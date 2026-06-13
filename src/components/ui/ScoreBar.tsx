type Props = {
  emoji: string
  label: string
  /** Hodnota 1–5. */
  value: number
}

/** Jednoduchý progress bar skóre 1–5 (segmenty). */
export function ScoreBar({ emoji, label, value }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-sm text-slate-300">
        {emoji} {label}
      </span>
      <div className="flex flex-1 gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`h-2 flex-1 rounded-full ${
              i < value ? 'bg-gradient-to-r from-water to-nature' : 'bg-white/10'
            }`}
          />
        ))}
      </div>
      <span className="w-6 shrink-0 text-right text-sm font-semibold text-slate-400">
        {value}
      </span>
    </div>
  )
}
