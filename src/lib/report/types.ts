export type ReportSection = {
  title: string;
  content: string;
};

export type ReportMetrics = {
  hookStrength: number;
  retentionPotential: number;
  emotionalImpact: number;
  shareability: number;
  finalScore: number;
};

export type Rewrite = {
  hookRewrite: string;
  optimizedScript: string;
  titles: string[];
  thumbnailIdea: string;
};

export type FullReport = {
  sections: Record<string, ReportSection>;
  metrics: ReportMetrics;
  rewrite?: Rewrite;
};
