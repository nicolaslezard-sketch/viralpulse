import { inngest } from "../client";

export const ping = inngest.createFunction(
  { id: "ping-test" },
  { event: "ping/test" },
  async () => {
    console.log("PING OK");
    return { ok: true };
  }
);
