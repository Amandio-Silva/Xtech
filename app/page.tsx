"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Zap, Shield, Headphones, ChevronDown, LogIn, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    setIsVisible(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Advanced Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-gray-800/20 to-gray-700/30" />

        {/* Floating orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-white/10 to-gray-300/10 rounded-full blur-3xl animate-pulse opacity-60" />
          <div
            className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-gray-300/10 to-white/10 rounded-full blur-3xl animate-pulse opacity-40"
            style={{ animationDelay: "2s" }}
          />
          <div
            className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-white/5 to-gray-400/5 rounded-full blur-2xl animate-pulse opacity-30"
            style={{ animationDelay: "4s" }}
          />
        </div>

        {/* Moving mouse orb */}
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-white/15 to-gray-300/15 rounded-full blur-3xl transition-all duration-1000 ease-out opacity-70"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0 animate-pulse"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
              animationDuration: "4s",
            }}
          />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-bounce opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Gradient waves */}
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-12 animate-pulse"
            style={{ animationDuration: "6s" }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-l from-transparent via-gray-300/5 to-transparent transform skew-y-12 animate-pulse"
            style={{ animationDuration: "8s", animationDelay: "2s" }}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div
            className={`text-2xl font-bold text-white transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}
          >
            <div className="flex items-center space-x-3">
              <Image src="/images/xtech-logo.png" alt="Xtech Logo" width={32} height={32} className="w-8 h-8" />
              <div className="text-2xl font-bold text-white">Xtech</div>
            </div>
          </div>
          <div
            className={`flex items-center space-x-8 transition-all duration-1000 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"}`}
          >
            <div className="hidden md:flex space-x-8">
              <Link
                href="/products"
                className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
              >
                Produtos
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                href="/services"
                className="text-gray-300 hover:text-white transition-colors duration-300 relative group"
              >
                Serviços
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-2">
                  <Link href={user.is_admin ? "/admin" : "/profile"}>
                    <Button
                      variant="outline"
                      className="border-2 border-gray-600 text-white hover:border-white hover:text-white hover:bg-white/10 font-semibold transition-all duration-300 transform hover:scale-105 bg-transparent backdrop-blur-sm"
                    >
                      <User className="mr-2 h-4 w-4" />
                      {user.name}
                    </Button>
                  </Link>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    className="hover:bg-gray-800/50 text-gray-300 hover:text-white"
                  >
                    Sair
                  </Button>
                </div>
              ) : (
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    className="border-2 border-gray-600 text-white hover:border-white hover:text-white hover:bg-white/10 font-semibold transition-all duration-300 transform hover:scale-105 bg-transparent backdrop-blur-sm"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white animate-pulse">FUTURO</h1>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-gray-300">DA TECNOLOGIA</h2>
          </div>

          <div
            className={`transition-all duration-1000 delay-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
          >
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Descubra os produtos mais inovadores e serviços de reparação de última geração. Onde a tecnologia encontra
              o design.
            </p>
          </div>

          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 delay-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
          >
            <Link href="/products">
              <Button className="group relative px-8 py-4 bg-white text-black hover:bg-gray-200 font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/25">
                <span className="relative z-10 flex items-center">
                  Explorar Produtos
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>

            <Link href="/services">
              <Button
                variant="outline"
                className="group px-8 py-4 border-2 border-gray-600 text-white hover:border-white hover:text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 bg-transparent backdrop-blur-sm"
              >
                <span className="flex items-center">
                  Serviços de Reparação
                  <Zap className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
                </span>
              </Button>
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div
            className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
          >
            <ChevronDown className="h-8 w-8 text-gray-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">Por que escolher-nos?</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Combinamos tecnologia de ponta com design excepcional para oferecer a melhor experiência
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Tecnologia Avançada",
                description: "Os produtos mais recentes e inovadores do mercado tecnológico mundial",
              },
              {
                icon: Shield,
                title: "Garantia Premium",
                description: "Proteção completa e suporte técnico especializado para todos os produtos",
              },
              {
                icon: Headphones,
                title: "Suporte 24/7",
                description: "Atendimento personalizado e reparações rápidas com técnicos certificados",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 hover:border-white/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
                style={{ transitionDelay: `${1000 + index * 200}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-gray-300/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div
                  className={`relative z-10 w-16 h-16 rounded-full bg-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="h-8 w-8 text-black" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gray-200 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 rounded-3xl bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50">
            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-gray-300/5 rounded-3xl animate-pulse" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Pronto para o Futuro?</h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Junte-se a milhares de clientes satisfeitos e descubra a próxima geração de tecnologia
              </p>
              <Link href="/products">
                <Button className="group relative px-12 py-6 bg-white text-black hover:bg-gray-200 font-bold text-lg rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-white/25">
                  <span className="relative z-10 flex items-center">
                    Começar Agora
                    <ArrowRight className="ml-3 h-6 w-6 transition-transform duration-300 group-hover:translate-x-2" />
                  </span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-800 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Image src="/images/xtech-logo.png" alt="Xtech Logo" width={24} height={24} className="w-6 h-6" />
            <div className="text-2xl font-bold text-white">Xtech</div>
          </div>
          <p className="text-gray-400 mb-6">O futuro da tecnologia está aqui</p>
          <div className="flex justify-center space-x-8 text-gray-400">
            <Link href="/products" className="hover:text-white transition-colors duration-300">
              Produtos
            </Link>
            <Link href="/services" className="hover:text-white transition-colors duration-300">
              Serviços
            </Link>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-gray-500">
            <p>&copy; 2024 Xtech. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
