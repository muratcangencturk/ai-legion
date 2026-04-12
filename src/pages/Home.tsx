import { useMemo, useState, useEffect } from 'react'
import axios from 'axios'
import ShareActions from '../components/ShareActions'
import { tutorials } from '../data/tutorials'

type Language = 'tr' | 'en'

interface Article {
  id: string
  title: string
  content: string
  category: string
  image_url?: string
  source_url?: string
  created_at: string
}

interface Tool {
  id: string
  name: string
  category: string
  description: string
  url?: string
}

interface Post {
  id: string
  user_id: string
  username?: string
  content: string
  created_at: string
}

const text = {
  tr: {
    hero: 'Profesyonel AI akışı',
    social: 'Sosyaldan En Yeni 5',
    news: 'Haberlerden En Yeni 5',
    tools: 'Araçlar',
    tutorials: 'Öğreticiler',
    loading: 'İçerikler yükleniyor...',
    readMore: 'Oku',
    readLess: 'Daha az',
    noData: 'Henüz içerik yok.',
    by: 'tarafından'
  },
  en: {
    hero: 'Professional AI feed',
    social: 'Latest 5 from Social',
    news: 'Latest 5 News',
    tools: 'Tools',
    tutorials: 'Tutorials',
    loading: 'Loading content...',
    readMore: 'Read more',
    readLess: 'Read less',
    noData: 'No content yet.',
    by: 'by'
  }
}

const tagColors = ['#0ea5e9', '#22c55e', '#a855f7', '#f59e0b', '#ef4444', '#14b8a6']

export default function Home({ apiUrl, language, onOpenProfile }: { apiUrl: string; onNavigate: (page: string) => void; language: Language; onOpenProfile: (username: string) => void }) {
  const t = text[language]
  const [articles, setArticles] = useState<Article[]>([])
  const [tools, setTools] = useState<Tool[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [activeTag, setActiveTag] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [articlesResponse, toolsResponse, postsResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/articles`),
          axios.get(`${apiUrl}/api/tools`).catch(() => ({ data: [] })),
          axios.get(`${apiUrl}/api/posts`).catch(() => ({ data: [] }))
        ])
        setArticles(articlesResponse.data || [])
        setTools(toolsResponse.data || [])
        setPosts(postsResponse.data || [])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [apiUrl])

  const sortedPosts = useMemo(() => [...posts].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 5), [posts])
  const sortedArticles = useMemo(() => [...articles].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 5), [articles])
  const sortedTools = useMemo(() => [...tools].slice(0, 5), [tools])
  const tutorialList = tutorials.slice(0, 5)

  const resolveTagColor = (tag: string) => tagColors[Math.abs(tag.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) % tagColors.length]

  const shouldShowTag = (tag: string) => !activeTag || activeTag === tag

  const toggleExpand = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div>
      <div className="hero"><h1>AI LEGION</h1><p>{t.hero}</p></div>

      <section className="section-box">
        <h3>{t.social}</h3>
        {loading ? <div className="loading">{t.loading}</div> : sortedPosts.length === 0 ? <p>{t.noData}</p> : (
          <div className="grid uniform-grid">
            {sortedPosts.map((post) => {
              const profileName = post.username || `Kullanıcı #${post.user_id.slice(0, 8)}`
              const cardId = `post-${post.id}`
              const isExpanded = expanded[cardId]
              return (
                <article key={post.id} className={`card uniform-card ${isExpanded ? 'expanded' : ''}`} onClick={() => toggleExpand(cardId)}>
                  <div className="post-header">
                    <button className="profile-link" onClick={(e) => { e.stopPropagation(); onOpenProfile(profileName) }}>{profileName}</button>
                    <small>{new Date(post.created_at).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')}</small>
                  </div>
                  <p className={`clamp-content ${isExpanded ? 'open' : ''}`}>{post.content}</p>
                  <button type="button" className="secondary-btn" onClick={(e) => { e.stopPropagation(); toggleExpand(cardId) }}>{isExpanded ? t.readLess : t.readMore}</button>
                  <ShareActions path={`/social/${post.id}`} title={post.content.slice(0, 40)} language={language} />
                </article>
              )
            })}
          </div>
        )}
      </section>

      <section className="section-box">
        <h3>{t.news}</h3>
        <div className="tag-row">
          {[...new Set(sortedArticles.map((a) => a.category))].map((tag) => (
            <button key={tag} className={`tag-chip ${activeTag === tag ? 'active' : ''}`} style={{ borderColor: resolveTagColor(tag), color: resolveTagColor(tag) }} onClick={() => setActiveTag(activeTag === tag ? '' : tag)}>{tag}</button>
          ))}
        </div>
        {sortedArticles.length === 0 ? <p>{t.noData}</p> : (
          <div className="grid uniform-grid">
            {sortedArticles.filter((a) => shouldShowTag(a.category)).map((article) => {
              const cardId = `article-${article.id}`
              const isExpanded = expanded[cardId]
              return (
                <article key={article.id} className={`card uniform-card ${isExpanded ? 'expanded' : ''}`} onClick={() => toggleExpand(cardId)}>
                  <h4>{article.title}</h4>
                  <span className="tool-category" style={{ background: resolveTagColor(article.category) }}>{article.category}</span>
                  <p className={`clamp-content ${isExpanded ? 'open' : ''}`}>{article.content}</p>
                  <div className="card-footer-row">
                    <button className="secondary-btn" onClick={(e) => { e.stopPropagation(); toggleExpand(cardId) }}>{isExpanded ? t.readLess : t.readMore}</button>
                    <ShareActions path={`/news/${article.id}`} title={article.title} language={language} />
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      <section className="section-box">
        <h3>{t.tools}</h3>
        <div className="grid uniform-grid">
          {sortedTools.map((tool) => <article key={tool.id} className="card uniform-card"><h4>{tool.name}</h4><span className="tool-category" style={{ background: resolveTagColor(tool.category) }}>{tool.category}</span><p className="clamp-content">{tool.description}</p></article>)}
        </div>
      </section>

      <section className="section-box">
        <h3>{t.tutorials}</h3>
        <div className="grid uniform-grid">
          {tutorialList.map((tutorial) => <article key={tutorial.id} className="card uniform-card"><h4>{tutorial.title[language]}</h4><p className="clamp-content">{tutorial.summary[language]}</p></article>)}
        </div>
      </section>
    </div>
  )
}
