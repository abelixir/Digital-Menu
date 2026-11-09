import { BrowserRouter, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Menu from './pages/Menu'
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
]

function AppLayout() {
  const navigate = useNavigate()
  const isLoggedIn = Boolean(localStorage.getItem('token'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-stone-100 text-slate-900">
      <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-lg font-bold text-white shadow-sm">
              D
            </div>
            <div>
              <p className="text-lg font-semibold tracking-tight">Digital Menu</p>
              <p className="text-xs text-stone-500">Bistro & Grill</p>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${
                    isActive ? 'text-orange-600' : 'text-stone-600 hover:text-stone-900'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive ? 'text-orange-600' : 'text-stone-600 hover:text-stone-900'
                }`
              }
            >
              Admin
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <NavLink
                  to="/admin"
                  className="rounded-full border border-stone-200 bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-200"
                >
                  Dashboard
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/admin/login"
                className="rounded-full border border-stone-200 bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-300 hover:bg-stone-200"
              >
                Admin Login
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route
            path="/admin/login"
            element={isLoggedIn ? <Navigate to="/admin" replace /> : <AdminLogin />}
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
