type BookCoverProps = {
  title: string
  eyebrow?: string
  color: string
  accent: string
  compact?: boolean
}

export function BookCover({ title, eyebrow = 'ENGLISH COURSE', color, accent, compact = false }: BookCoverProps) {
  const words = title.split(' ')
  const leading = words.slice(0, -1).join(' ') || words[0]
  const ending = words.length > 1 ? words[words.length - 1] : ''

  return (
    <div
      className={`book-cover ${compact ? 'book-cover--compact' : ''}`}
      style={{ '--cover': color, '--cover-accent': accent } as React.CSSProperties}
      aria-label={`تصویر جلد ${title}`}
      role="img"
    >
      <span className="book-cover__publisher">PARDIS</span>
      <span className="book-cover__eyebrow">{eyebrow}</span>
      <strong>
        {leading}
        {ending && <em>{ending}</em>}
      </strong>
      <span className="book-cover__shape" />
      <span className="book-cover__line" />
    </div>
  )
}
