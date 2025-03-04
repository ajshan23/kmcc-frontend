import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(undefined)

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

const authSessionKey = '_TECHMIN_AUTH_KEY_'

export function AuthProvider({ children }) {
  const navigate = useNavigate()

  const getSession = () => {
    const storedUser = localStorage.getItem(authSessionKey)
    return storedUser ? JSON.parse(storedUser) : null
  }

  const [user, setUser] = useState(getSession())

  const saveSession = (user) => {
    localStorage.setItem(authSessionKey, JSON.stringify(user))
    setUser(user)
  }

  const removeSession = () => {
    localStorage.removeItem(authSessionKey)
    setUser(null)
    navigate('/auth/login')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        saveSession,
        removeSession,
      }}>
      {children}
    </AuthContext.Provider>
  )
}
