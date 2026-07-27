export default function LevelBadge({
  level,
  bracket = false,
}: {
  level: number;
  bracket?: boolean;
}) {
  const text = bracket ? `[Lv.${level}]` : `Lv.${level}`;

  return (
    <span className="mr-1 inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-bold text-accent">
      {text}
    </span>
  );
}
