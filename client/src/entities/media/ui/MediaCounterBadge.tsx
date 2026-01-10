type Props = {
  activeIndex: number;
  total: number;
};

export function MediaCounterBadge({ activeIndex, total }: Props) {
  if (total <= 1) return null;

  return (
    <div className="pointer-events-none absolute bottom-2 right-2 z-20 rounded-md bg-black/60 px-2 py-1 text-xs text-white">
      {activeIndex + 1}/{total}
    </div>
  );
}
