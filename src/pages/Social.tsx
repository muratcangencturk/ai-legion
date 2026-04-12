import { useState, useEffect } from 'react'
import axios from 'axios'
import ShareActions from '../components/ShareActions'

type Language = 'tr' | 'en'

interface Post {
  id: string
  user_id: string
  username?: string
  content: string
  likes_count: number
  reposts_count: number
  comments_count: number
  created_at: string
}

const text = {
  tr: {
    title: 'Sosyal Feed', loginInfo: 'Paylaşım için giriş yapın.', username: 'Kullanıcı adı', password: 'Şifre', login: 'Giriş Yap', thoughts: 'Ne düşünüyorsun?', post: 'Gönder', loading: 'Postlar yükleniyor...', noPosts: 'Henüz post yok.', user: 'Kullanıcı'
  },
  en: {
    title: 'Social Feed', loginInfo: 'Login to post.', username: 'Username', password: 'Password', login: 'Log In', thoughts: 'What are you thinking?', post: 'Post', loading: 'Loading posts...', noPosts: 'No posts yet.', user: 'User'
  }
}

export default function Social({ apiUrl, user, setUser, language, onOpenProfile }: { apiUrl: string; user: any; setUser: any; language: Language; onOpenProfile: (username: string) => void }) {
  const t = text[language]
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState('')
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/posts`)
      setPosts(response.data)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await axios.post(`${apiUrl}/api/auth/login`, { username, password })
    setUser({ username, token: response.data.token })
    setUsername('')
    setPassword('')
  }

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim() || !user) return
    await axios.post(`${apiUrl}/api/posts`, { content: newPost, token: user?.token })
    setNewPost('')
    fetchPosts()
  }

  return (
    <div>
      <h2 className="section-title">{t.title}</h2>
      {!user ? (
        <div className="card" style={{ marginBottom: '20px' }}>
          <p>{t.loginInfo}</p>
          <form onSubmit={handleLogin} className="login-row">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t.username} required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t.password} required />
            <button type="submit">{t.login}</button>
          </form>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: '24px' }}>
          <form onSubmit={handlePostSubmit}>
            <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder={t.thoughts} style={{ width: '100%', minHeight: '90px', marginBottom: '10px' }} />
            <button type="submit" className="icon-btn" title={t.post}>➤</button>
          </form>
        </div>
      )}

      {loading ? <div className="loading">{t.loading}</div> : posts.length === 0 ? <div className="card"><p>{t.noPosts}</p></div> : posts.map(post => {
        const name = post.username || `${t.user} #${post.user_id.substring(0, 8)}`
        return (
          <article key={post.id} className="post clickable-card">
            <div className="post-header">
              <button className="profile-link" onClick={() => onOpenProfile(name)}>{name}</button>
              <small>{new Date(post.created_at).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')}</small>
            </div>
            <div className="post-content">{post.content}</div>
            <div className="post-actions"><span className="post-action">♡ {post.likes_count}</span><span className="post-action">↻ {post.reposts_count}</span><span className="post-action">💬 {post.comments_count}</span></div>
            <ShareActions path={`/social/${post.id}`} title={post.content.slice(0, 40)} language={language} />
          </article>
        )
      })}
    </div>
  )
}
