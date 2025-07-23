"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, LogIn, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { login } from "@/lib/auth"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login: authLogin } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await login(email, password)

    if (result.success && result.user) {
      authLogin(result.user)
      if (result.user.is_admin) {
        router.push("/admin")
      } else {
        router.push("/profile")
      }
    } else {
      setError(result.error || "Erro ao fazer login")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-gray-800/20 to-gray-700/20" />
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/images/xtech-logo.png" alt="Xtech Logo" width={32} height={32} className="w-8 h-8" />
              <span className="text-2xl font-bold text-white">Xtech</span>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="hover:bg-gray-800/50">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md mt-16">
        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white flex items-center justify-center">
              <LogIn className="mr-3 h-6 w-6" />
              Login Admin
            </CardTitle>
            <p className="text-gray-400">Aceda ao painel de administração</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-white focus:ring-white/20"
                  placeholder="admin@techstore.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-white focus:ring-white/20 pr-10"
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded p-3">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-3 transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? "A entrar..." : "Entrar"}
              </Button>

              <div className="text-center">
                <p className="text-gray-400">
                  Não tem conta?{" "}
                  <Link href="/auth/register" className="text-white hover:underline">
                    Criar conta
                  </Link>
                </p>
              </div>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-gray-800/30 rounded border border-gray-700/50">
              <p className="text-sm text-gray-400 mb-2">Credenciais de demonstração:</p>
              <p className="text-sm text-white">Email: admin@xtech.com</p>
              <p className="text-sm text-white">Password: admin123</p>
              <p className="text-sm text-gray-400 mt-2">Após login, aceda a: /admin</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
