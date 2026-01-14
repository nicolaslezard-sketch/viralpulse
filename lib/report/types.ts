export type ReportSection = {
  title: string;
  content: string;
};

export type FullReport = Record<string, ReportSection>;
