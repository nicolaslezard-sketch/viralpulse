import { CopyButton } from "@/components/ui/CopyButton";

type Props = {
  title: string;
  content: string;
};

export function InsightCard({ title, content }: Props) {
  const lines = content
    .split("\n")
    .map((l) =>
      l
        .replace(/^[-•]\s*/, "")
        .replace(/^\d+\.\s*/, "")
        .trim(),
    )
    .filter(Boolean);

  const copyText = lines.join("\n");

  return (
    <div className="rounded-xl bg-linear-to-b from-[#0f172a] to-[#020617] p-6 border border-white/5">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-indigo-300 tracking-wide">
          {title}
        </h3>

        <CopyButton text={copyText} />
      </div>

      {/* content */}
      <ul className="space-y-2 text-sm text-white/80">
        {lines.map((line, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-indigo-400 font-semibold">{i + 1}.</span>

            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
