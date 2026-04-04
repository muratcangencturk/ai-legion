import { useState, useEffect } from 'react'
import axios from 'axios'
import Home from './pages/Home'
import Social from './pages/Social'
import Tools from './pages/Tools'
import Tutorials from './pages/Tutorials'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'

const API_URL = 'https://ai-legion-api.muratcangencturk.workers.dev'

const navItems = [
  { id: 'home', label: 'Haberler', icon: '📰' },
  { id: 'social', label: 'Sosyal', icon: '💬' },
  { id: 'tools', label: 'Araçlar', icon: '⚙️' },
  { id: 'tutorials', label: 'Öğretici', icon: '📚' },
  { id: 'profile', label: 'Profil', icon: '👤' },
  { id: 'admin', label: 'Admin', icon: '🛡️' },
]

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await axios.get(`${API_URL}/health`)
        console.log('✅ Workers API çalışıyor:', response.data)
      } catch (error) {
        console.error('❌ Workers API bağlantı hatası:', error)
      }
    }
    checkHealth()
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home apiUrl={API_URL} />
      case 'social':
        return <Social apiUrl={API_URL} user={user} setUser={setUser} />
      case 'tools':
        return <Tools apiUrl={API_URL} />
      case 'tutorials':
        return <Tutorials />
      case 'profile':
        return <Profile apiUrl={API_URL} user={user} />
      case 'admin':
        return <AdminPanel apiUrl={API_URL} />
      default:
        return <Home apiUrl={API_URL} />
    }
  }

  return (
    <div className="app-shell">
      <header className="header">
        <div className="container header-content">
          <div className="brand-block">
            <img
              className="brand-logo"
              src="/logo.png"
              alt="AI Legion logosu"
              onError={(event) => {
                ;(event.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
            <div>
              <h1 className="brand-title">AI LEGION</h1>
              <p className="brand-subtitle">Roma disiplini × Yapay Zeka zekâsı</p>
            </div>
          </div>

          {user && <span className="user-chip">👤 {user.username}</span>}
        </div>

        <div className="container">
          <nav className="nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => setCurrentPage(item.id)}
              >
                <span>{item.icon}</span> {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container main-content">{renderPage()}</main>

      <footer className="footer">
        <p>© 2026 AI Legion — Cloudflare Pages + Workers</p>
        <p className="footer-meta">API: {API_URL}</p>
      </footer>
    </div>
  )
}

export default App
