export default function FAQSection() {
  const items = [
    {
      q: "Does ViralPulse fully analyze the visuals of my video?",
      a: "Not fully yet. Video uploads are currently processed through extracted audio and transcript. This works best for talking-head videos, voiceovers, commentary, interviews, podcasts and educational content.",
    },
    {
      q: "What kinds of videos are a weaker fit right now?",
      a: "Highly visual comedy, silent reaction clips, text-heavy edits, meme videos, image-based jokes, facial-expression-driven content and videos where the payoff depends mostly on what is seen on screen.",
    },
    {
      q: "What does ViralPulse do with video uploads?",
      a: "We extract the audio, generate a transcript, score the content, create strategy insights and generate rewrite suggestions based on the spoken content.",
    },
    {
      q: "Do you store my uploaded media forever?",
      a: "No. After processing is completed, the uploaded media is deleted from storage. The resulting analysis data remains available in your account according to your plan.",
    },
    {
      q: "What content format works best?",
      a: "The strongest fit today is spoken content: talking-head clips, voiceovers, interviews, educational videos, commentary, podcast clips and explainers.",
    },
    {
      q: "Can I upload audio only?",
      a: "Yes. Audio-only uploads are fully supported and are often the best fit for the current analysis pipeline.",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 text-white">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold">Frequently asked questions</h2>
        <p className="mt-3 text-zinc-400">
          What ViralPulse analyzes today, where it works best, and what to
          expect from video uploads.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-4xl gap-4">
        {items.map((item) => (
          <div
            key={item.q}
            className="rounded-2xl border border-white/10 bg-black/30 p-6"
          >
            <h3 className="text-base font-semibold text-white">{item.q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
