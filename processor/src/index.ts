import "dotenv/config";

import { pullMessages } from "./pullMessages";
import { ackMessage } from "./ackMessages";
import { processJob, type AnalysisJob } from "./processJob";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("VP processor started");

  while (true) {
    try {
      const messages = await pullMessages<AnalysisJob>();

      if (messages.length === 0) {
        await sleep(3000);
        continue;
      }

      for (const message of messages) {
        try {
          await processJob(message.body);
          await ackMessage(message.lease_id);
          console.log("Acked job:", message.body.reportId);
        } catch (err) {
          console.error("Job failed:", err);
        }
      }
    } catch (err) {
      console.error("Processor loop error:", err);
      await sleep(5000);
    }
  }
}

main().catch((err) => {
  console.error("Fatal processor error:", err);
  process.exit(1);
});
