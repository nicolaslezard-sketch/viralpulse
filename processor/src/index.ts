import "dotenv/config";

console.log("PROCESSOR CWD:", process.cwd());
console.log("PROCESSOR DATABASE_URL EXISTS:", !!process.env.DATABASE_URL);
console.log("PROCESSOR OPENAI_API_KEY EXISTS:", !!process.env.OPENAI_API_KEY);

import { pullMessages } from "./pullMessages";
import { ackMessage } from "./ackMessages";
import { prisma } from "./lib/prisma";
import { processJob, PermanentJobError } from "./processJob";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldAckFailedJob(err: unknown) {
  return err instanceof PermanentJobError;
}

async function main() {
  console.log("VP processor started");

  try {
    await prisma.$connect();
    console.log("Processor connected to DB");
  } catch (err) {
    console.error("Processor DB boot error:", err);
    process.exit(1);
  }

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

          const shouldAck = shouldAckFailedJob(err);

          if (!shouldAck) {
            console.log("Job not acked so it can be retried");
            continue;
          }

          try {
            await ackMessage(message.lease_id);
            console.log("Acked permanently invalid job");
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
