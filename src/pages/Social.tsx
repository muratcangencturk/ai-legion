import { useState, useEffect } from 'react'
import axios from 'axios'
import ShareActions from '../components/ShareActions'

interface Post {
  id: string
  user_id: string
  content: string
  likes_count: number
  reposts_count: number
  comments_count: number
  created_at: string
}

export default function Social({ apiUrl, user, setUser }: { apiUrl: string; user: any; setUser: any }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [newPost, setNewPost] = useState('')
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(user))

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/posts`)
      setPosts(response.data)
    } catch (error) {
      console.error('Postlar yüklenirken hata:', error)
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
      alert('Giriş başarısız: ' + (error as any).response?.data?.error)
    }
  }

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPost.trim() || !isLoggedIn) return

    try {
      await axios.post(`${apiUrl}/api/posts`, {
        content: newPost,
        token: user?.token
      })
      setNewPost('')
      fetchPosts()
    } catch (error) {
      alert('Post atarken hata: ' + (error as any).response?.data?.error)
    }
  }

  const handleLike = async (postId: string) => {
    if (!isLoggedIn) return
    try {
      await axios.post(`${apiUrl}/api/posts/${postId}/like`, { token: user?.token })
      fetchPosts()
    } catch (error) {
      console.error('Like atarken hata:', error)
    }
  }

  return (
    <div>
      <h2 style={{ color: '#d4af37', marginBottom: '20px' }}>💬 Sosyal Feed</h2>

      {!isLoggedIn ? (
        <div className="card" style={{ marginBottom: '20px' }}>
          <p style={{ marginBottom: '10px' }}>Paylaşım yapmak için giriş yapın. Okuma herkes için açık.</p>
          <form onSubmit={handleLogin} className="login-row">
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Kullanıcı adı" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifre" required />
            <button type="submit">Giriş Yap</button>
          </form>
        </div>
      ) : (
        <div className="card" style={{ marginBottom: '30px' }}>
          <p style={{ marginBottom: '10px' }}>Hoş geldiniz, <strong>{user?.username}</strong>!</p>
          <form onSubmit={handlePostSubmit}>
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Neler düşünüyorsunuz?"
              style={{ width: '100%', minHeight: '100px', marginBottom: '10px' }}
            />
            <button type="submit">📤 Post At</button>
            <button type="button" onClick={() => setIsLoggedIn(false)} style={{ marginLeft: '10px', background: '#c41e3a' }}>
              Çıkış Yap
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="loading">Postlar yükleniyor...</div>
      ) : posts.length === 0 ? (
        <div className="card">
          <p>Henüz post yok. İlk postu siz atın!</p>
        </div>
      ) : (
        posts.map(post => (
          <article key={post.id} className="post clickable-card">
            <div className="post-header">
              <span>Kullanıcı #{post.user_id.substring(0, 8)}</span>
              <small>{new Date(post.created_at).toLocaleString('tr-TR')}</small>
            </div>
            <div className="post-content">{post.content}</div>
            <div className="post-actions">
              <span onClick={() => handleLike(post.id)} className="post-action">❤️ {post.likes_count}</span>
              <span className="post-action">🔄 {post.reposts_count}</span>
              <span className="post-action">💬 {post.comments_count}</span>
            </div>
            <div className="card-footer-row">
              <span />
              <ShareActions path={`/social/${post.id}`} title="AI Legion sosyal gönderisi" />
            </div>
          </article>
        ))
      )}
    </div>
  )
}
