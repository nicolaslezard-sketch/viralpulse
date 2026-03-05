import { InsightCard } from "./InsightCard";
import { LockedCard } from "./LockedCard";
import type { FullReport } from "@/lib/report/types";

type Props = {
  title: string;
  sections: string[];
  report: FullReport;
  isPro: boolean;
};

export function InsightBlock({ title, sections, report, isPro }: Props) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-4">{title}</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {sections.map((key) => {
          const section = report.sections[key];

          if (!section) return null;

          const locked = !isPro && !["SUMMARY", "VIRAL REASON"].includes(key);

          if (locked) {
            return <LockedCard key={key} title={key} />;
          }

          return (
            <InsightCard
              key={key}
              title={section.title}
              content={section.content}
            />
          );
        })}
      </div>
    </div>
  );
}
