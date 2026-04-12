import { useState, useEffect } from 'react'
import axios from 'axios'
import ShareActions from '../components/ShareActions'

type Language = 'tr' | 'en'

interface Post {
  id: string
  user_id: string
  content: string
  likes_count: number
  reposts_count: number
  comments_count: number
  created_at: string
}

const text = {
  tr: {
    title: '💬 Sosyal Feed', loginInfo: 'Paylaşım yapmak için giriş yapın. Okuma herkes için açık.', username: 'Kullanıcı adı', password: 'Şifre', login: 'Giriş Yap', welcome: 'Hoş geldiniz,', thoughts: 'Neler düşünüyorsunuz?', post: '📤 Post At', logout: 'Çıkış Yap', loading: 'Postlar yükleniyor...', noPosts: 'Henüz post yok. İlk postu siz atın!', user: 'Kullanıcı', loginFailed: 'Giriş başarısız: ', postError: 'Post atarken hata: ', likeError: 'Beğeni atarken hata:', shareTitle: 'AI Legion sosyal gönderisi'
  },
  en: {
    title: '💬 Social Feed', loginInfo: 'Log in to post. Reading is open to everyone.', username: 'Username', password: 'Password', login: 'Log In', welcome: 'Welcome,', thoughts: 'What are you thinking?', post: '📤 Post', logout: 'Log Out', loading: 'Loading posts...', noPosts: 'No posts yet. Be the first to post!', user: 'User', loginFailed: 'Login failed: ', postError: 'Error posting: ', likeError: 'Error while liking:', shareTitle: 'AI Legion social post'
  }
}

export default function Social({ apiUrl, user, setUser, language }: { apiUrl: string; user: any; setUser: any; language: Language }) {
  const t = text[language]
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState('')
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(user))

  useEffect(() => { fetchPosts() }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/posts`)
      setPosts(response.data)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, { username, password })
      setUser({ username, token: response.data.token })
      setIsLoggedIn(true)
      setUsername('')
      setPassword('')
    } catch (error) {
      alert(t.loginFailed + (error as any).response?.data?.error)
    }
  }

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim() || !isLoggedIn) return
    try {
      await axios.post(`${apiUrl}/api/posts`, { content: newPost, token: user?.token })
      setNewPost('')
      fetchPosts()
    } catch (error) {
      alert(t.postError + (error as any).response?.data?.error)
    }
  }

  const handleLike = async (postId: string) => {
    if (!isLoggedIn) return
    try {
      await axios.post(`${apiUrl}/api/posts/${postId}/like`, { token: user?.token })
      fetchPosts()
    } catch (error) {
      console.error(t.likeError, error)
    }
  }

  return (
    <div>
      <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>{t.title}</h2>
      {!isLoggedIn ? (
        <div className="card" style={{ marginBottom: '20px' }}>
          <p style={{ marginBottom: '10px' }}>{t.loginInfo}</p>
          <form onSubmit={handleLogin} className="login-row">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder={t.username} required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t.password} required />
            <button type="submit">{t.login}</button>
          </form>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: '30px' }}>
          <p style={{ marginBottom: '10px' }}>{t.welcome} <strong>{user?.username}</strong>!</p>
          <form onSubmit={handlePostSubmit}>
            <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder={t.thoughts} style={{ width: '100%', minHeight: '100px', marginBottom: '10px' }} />
            <button type="submit">{t.post}</button>
            <button type="button" onClick={() => setIsLoggedIn(false)} style={{ marginLeft: '10px', background: '#c41e3a' }}>{t.logout}</button>
          </form>
        </div>
      )}
      {loading ? <div className="loading">{t.loading}</div> : posts.length === 0 ? <div className="card"><p>{t.noPosts}</p></div> : posts.map(post => (
        <article key={post.id} className="post clickable-card">
          <div className="post-header"><span>{t.user} #{post.user_id.substring(0, 8)}</span><small>{new Date(post.created_at).toLocaleString(language === 'tr' ? 'tr-TR' : 'en-US')}</small></div>
          <div className="post-content">{post.content}</div>
          <div className="post-actions"><span onClick={() => handleLike(post.id)} className="post-action">❤️ {post.likes_count}</span><span className="post-action">🔄 {post.reposts_count}</span><span className="post-action">💬 {post.comments_count}</span></div>
          <div className="card-footer-row"><span /><ShareActions path={`/social/${post.id}`} title={t.shareTitle} language={language} /></div>
        </article>
      ))}
    </div>
  )
}
