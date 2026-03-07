import "dotenv/config";

import { pullMessages } from "./pullMessages";
import { ackMessage } from "./ackMessages";
import { processJob } from "./processJob";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("VP processor started");

  while (true) {
    try {
      const messages = await pullMessages();

      if (messages.length === 0) {
        await sleep(3000);
        continue;
      }

      for (const message of messages) {
        try {
          console.log("Pulled raw message body:", JSON.stringify(message.body));
          await processJob(message.body);
          await ackMessage(message.lease_id);
          console.log("Acked job");
        } catch (err) {
          console.error("Job failed:", err);

          // ACK igual si el mensaje es inválido, para no quedar en loop infinito
          try {
            await ackMessage(message.lease_id);
            console.log("Acked invalid/failed job");
          } catch (ackErr) {
            console.error("Ack after failure also failed:", ackErr);
          }
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
