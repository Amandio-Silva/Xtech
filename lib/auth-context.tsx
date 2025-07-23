"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, AuthState } from "./auth"

interface AuthContextType extends AuthState {
  login: (user: User) => void
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    // Check for stored auth data
    const storedAuth = localStorage.getItem("xtech_auth")
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth)
        if (authData.isAuthenticated && authData.user) {
          setAuthState({
            user: authData.user,
            isAuthenticated: true,
            isLoading: false,
          })
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        setAuthState((prev) => ({ ...prev, isLoading: false }))
      }
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [])

  const login = (user: User) => {
    const newAuthState = {
      user,
      isAuthenticated: true,
      isLoading: false,
    }
    setAuthState(newAuthState)
    localStorage.setItem("xtech_auth", JSON.stringify(newAuthState))
  }

  const logout = () => {
    const newAuthState = {
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }
    setAuthState(newAuthState)
    localStorage.removeItem("xtech_auth")
  }

  const updateUser = (user: User) => {
    const newAuthState = {
      user,
      isAuthenticated: true,
      isLoading: false,
    }
    setAuthState(newAuthState)
    localStorage.setItem("xtech_auth", JSON.stringify(newAuthState))
  }

  return <AuthContext.Provider value={{ ...authState, login, logout, updateUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
