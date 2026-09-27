type Props = {
  angle?: number;
};

export function FreeGiftBadge({ angle = 0 }: Props) {
  return (
    <span
      className="pointer-events-none inline-flex h-[25px] min-w-[91px] items-center justify-center whitespace-nowrap border border-gift-line bg-gift px-3 text-[13px]/[22px] font-bold tracking-design text-gift-text uppercase"
      style={{ transform: `rotate(${angle}deg)` }}
    >
      Free gift
    </span>
  );
}
