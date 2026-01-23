"use client";

const STEPS = [
  "Uploading file",
  "Transcribing audio",
  "Detecting viral moments",
  "Generating hooks & titles",
];

export default function LoadingSteps({
  step,
}: {
  step: number;
}) {
  return (
    <div className="mt-8 space-y-4">
      {STEPS.map((label, index) => {
        const isActive = index === step;
        const isDone = index < step;

        return (
          <div
            key={label}
            className="flex items-center gap-3 text-sm"
          >
            {/* ICON */}
            <div className="w-4 h-4 flex items-center justify-center">
              {isDone ? (
                <div className="w-3 h-3 rounded-full bg-green-500" />
              ) : isActive ? (
                <div className="w-4 h-4 rounded-full border-2 border-white animate-spin border-t-transparent" />
              ) : (
                <div className="w-3 h-3 rounded-full bg-zinc-600" />
              )}
            </div>

            {/* TEXT */}
            <span
              className={
                isDone
                  ? "text-green-400"
                  : isActive
                  ? "text-white"
                  : "text-zinc-500"
              }
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
