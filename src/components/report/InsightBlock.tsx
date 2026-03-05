import { InsightCard } from "./InsightCard";
import { LockedCard } from "./LockedCard";
import type { FullReport } from "@/lib/report/types";

export function InsightBlock({
  title,
  sections,
  report,
  isPro,
}: {
  title: string;
  sections: string[];
  report: FullReport;
  isPro: boolean;
}) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {sections.map((key) => {
          const content = report.sections[key as keyof typeof report.sections];

          const locked = !isPro && !["SUMMARY", "VIRAL REASON"].includes(key);

          if (locked) {
            return <LockedCard key={key} title={key} />;
          }

          return (
            <InsightCard
              key={key}
              title={key.replaceAll("_", " ")}
              content={content}
            />
          );
        })}
      </div>
    </div>
  );
}
