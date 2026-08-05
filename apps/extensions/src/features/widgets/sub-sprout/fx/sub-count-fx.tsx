export const SUB_COUNT_DURATION_MS = 2200;

interface SubCountFXProps {
  count: number;
  triggerKey: number;
  durationMs?: number;
}

export function SubCountFX({
  count,
  triggerKey,
  durationMs = SUB_COUNT_DURATION_MS,
}: SubCountFXProps) {
  if (!Number.isFinite(count) || count <= 0) return null;

  return (
    <div
      key={triggerKey}
      className="pointer-events-none absolute inset-0 z-10 flex items-start justify-center pt-24"
      style={{ animation: `fx-sub-count ${durationMs}ms ease-out forwards` }}>
      <span className="fx-sub-count-text">
        <span className="fx-sub-count-x">x</span>
        {count}
      </span>
    </div>
  );
}
