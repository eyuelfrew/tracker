import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Habits from './pages/Habits'
import Journal from './pages/Journal'
import SingleJournal from './pages/SingleJournal'
import Finance from './pages/Finance'
import Settings from './pages/Settings'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <div className="flex">
                    <Navbar />
                    <main className="flex-1 ml-64">
                      <Dashboard />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/habits" element={
                <ProtectedRoute>
                  <div className="flex">
                    <Navbar />
                    <main className="flex-1 ml-64">
                      <Habits />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/journal" element={
                <ProtectedRoute>
                  <div className="flex">
                    <Navbar />
                    <main className="flex-1 ml-64">
                      <Journal />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/journal/:id" element={
                <ProtectedRoute>
                  <div className="flex">
                    <Navbar />
                    <main className="flex-1 ml-64">
                      <SingleJournal />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/finance" element={
                <ProtectedRoute>
                  <div className="flex">
                    <Navbar />
                    <main className="flex-1 ml-64">
                      <Finance />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <div className="flex">
                    <Navbar />
                    <main className="flex-1 ml-64">
                      <Settings />
                    </main>
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
