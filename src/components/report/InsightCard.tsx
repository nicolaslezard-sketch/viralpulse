type Props = {
  title: string;
  content: string;
};

export function InsightCard({ title, content }: Props) {
  return (
    <div className="rounded-xl bg-linear-to-b from-[#0f172a] to-[#020617] p-6 border border-white/5">
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <p className="text-sm text-white/80 whitespace-pre-line">{content}</p>
    </div>
  );
}
import { LockedCard } from "./LockedCard";

export function InsightBlock({
  title,
  sections,
  report,
  isPro,
}: {
  title: string;
  sections: string[];
  report: any;
  isPro: boolean;
}) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {sections.map((key) => {
          const content = report.sections[key];

          const locked = !isPro && !["SUMMARY", "VIRAL REASON"].includes(key);

          if (locked) {
            return <LockedCard key={key} title={key} />;
          }

          return <InsightCard key={key} title={key} content={content} />;
        })}
      </div>
    </div>
  );
}
