interface DetailModalProps {
  title: string
  content: string
  category?: string
  sourceUrl?: string
  onClose: () => void
  language: 'tr' | 'en'
}

export default function DetailModal({ title, content, category, sourceUrl, onClose, language }: DetailModalProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close">✕</button>
        <h3 style={{ color: '#d4af37', marginBottom: '8px' }}>{title}</h3>
        {category && <span className="tool-category">{category}</span>}
        <p style={{ marginTop: '12px', whiteSpace: 'pre-line' }}>{content}</p>
        {sourceUrl && <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="source-link" style={{ marginTop: '14px', display: 'inline-block' }}>{language === 'tr' ? 'Kaynağa git ↗' : 'Go to source ↗'}</a>}
      </div>
    </div>
  )
}
