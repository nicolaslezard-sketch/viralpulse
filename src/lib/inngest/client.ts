import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "viralpulse",
  signingKey: process.env.INNGEST_SIGNING_KEY, // 👈 CLAVE
});
