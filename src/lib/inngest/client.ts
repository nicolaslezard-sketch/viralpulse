import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "viralpulse",
  // ⚠️ SOLO para enviar eventos
  eventKey: process.env.INNGEST_EVENT_KEY,
});
