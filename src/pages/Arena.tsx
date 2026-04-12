import { useMemo, useState } from 'react'
import { modelSpecs } from '../data/models'

type Language = 'tr' | 'en'

const text = {
  tr: { title: 'Model Arena', provider: 'Sağlayıcı', license: 'Lisans', parameters: 'Parametre', speed: 'Token üretim hızı', system: 'Sistem', pricing: 'Plan ücret detayı', score: 'Resmi benchmark skorları', aiLegion: 'AI Legion skoru', rate: '10 yıldız üzerinden puanla', details: 'Detaylar' },
  en: { title: 'Model Arena', provider: 'Provider', license: 'License', parameters: 'Parameters', speed: 'Token generation speed', system: 'System', pricing: 'Plan pricing detail', score: 'Official benchmark scores', aiLegion: 'AI Legion score', rate: 'Rate out of 10 stars', details: 'Details' }
}

export default function Arena({ language }: { language: Language }) {
  const t = text[language]
  const [leftId, setLeftId] = useState(modelSpecs[0].id)
  const [rightId, setRightId] = useState(modelSpecs[1].id)
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    const raw = localStorage.getItem('arenaRatings')
    return raw ? JSON.parse(raw) : {}
  })

  const left = useMemo(() => modelSpecs.find((m) => m.id === leftId)!, [leftId])
  const right = useMemo(() => modelSpecs.find((m) => m.id === rightId)!, [rightId])

  const rateModel = (modelId: string, score: number) => {
    const next = { ...ratings, [modelId]: score }
    setRatings(next)
    localStorage.setItem('arenaRatings', JSON.stringify(next))
  }

  const legionScore = (modelId: string, base: number) => ((ratings[modelId] || base) / 10).toFixed(1)

  return (
    <div>
      <h2 className="section-title">{t.title}</h2>
      <div className="arena-selectors card">
        <select value={leftId} onChange={(e) => setLeftId(e.target.value)}>{modelSpecs.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
        <span style={{ fontWeight: 700 }}>VS</span>
        <select value={rightId} onChange={(e) => setRightId(e.target.value)}>{modelSpecs.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
      </div>

      <div className="grid uniform-grid">
        {[left, right].map((m) => (
          <article className="card uniform-card" key={m.id}>
            <h3>{m.name}</h3>
            <p><strong>{t.provider}:</strong> {m.provider}</p>
            <p><strong>{t.license}:</strong> {m.openSource[language]}</p>
            <p><strong>{t.parameters}:</strong> {m.parameters[language]}</p>
            <p><strong>{t.speed}:</strong> {m.generationSpeed[language]}</p>
            <p><strong>{t.pricing}:</strong> {m.pricing[language]}</p>
            <p><strong>{t.system}:</strong> {m.systemNeeds[language]}</p>
            <p><strong>{t.aiLegion}:</strong> ★ {legionScore(m.id, m.elo)}</p>
            <div style={{ marginTop: '8px' }}>
              <small>{t.rate}</small>
              <input type="range" min={1} max={10} step={0.5} value={ratings[m.id] || 8} onChange={(e) => rateModel(m.id, Number(e.target.value))} />
            </div>
          </article>
        ))}
      </div>

      <div className="card">
        <h3>{t.score}</h3>
        {[{ key: 'aime', label: 'AIME' }, { key: 'codebench', label: 'CodeBench' }, { key: 'swebench', label: 'SWE-bench' }, { key: 'elo', label: 'ELO' }].map((metric) => {
          const l = left[metric.key as keyof typeof left] as number
          const r = right[metric.key as keyof typeof right] as number
          const pct = Math.round((l / (l + r)) * 100)
          return (
            <div key={metric.key} style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><small>{metric.label}</small><small>{l} - {r}</small></div>
              <div className="arena-bar"><div className="arena-bar-left" style={{ width: `${pct}%` }} /></div>
            </div>
          )
        })}
        <button className="secondary-btn" style={{ marginTop: '12px' }}>{t.details}</button>
      </div>
    </div>
  )
}
