"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Wrench,
  Smartphone,
  Laptop,
  Tablet,
  Headphones,
  Clock,
  CheckCircle,
  Zap,
  Shield,
  Award,
  LogIn,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const services = [
  {
    icon: Smartphone,
    title: "Reparação de Smartphones",
    description: "Ecrãs partidos, baterias, problemas de software e hardware",
    price: "A partir de €29",
    time: "30min - 2h",
  },
  {
    icon: Laptop,
    title: "Reparação de Laptops",
    description: "Problemas de hardware, limpeza, upgrades e otimização",
    price: "A partir de €49",
    time: "2h - 24h",
  },
  {
    icon: Tablet,
    title: "Reparação de Tablets",
    description: "Ecrãs, baterias, problemas de carregamento e conectividade",
    price: "A partir de €39",
    time: "1h - 4h",
  },
  {
    icon: Headphones,
    title: "Reparação de Audio",
    description: "Auscultadores, colunas, problemas de conectividade",
    price: "A partir de €19",
    time: "30min - 1h",
  },
]

export default function ServicesPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    device: "",
    problem: "",
    description: "",
  })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    // Adicionar animações CSS personalizadas
    const style = document.createElement("style")
    style.textContent = `
      @keyframes circuit {
        0% { transform: translate(0, 0); }
        100% { transform: translate(60px, 60px); }
      }
      @keyframes wrenchFloat {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
        50% { transform: translateY(-15px) rotate(180deg); opacity: 0.6; }
      }
    `
    document.head.appendChild(style)

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    alert("Pedido de reparação enviado com sucesso!")
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Dynamic Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-gray-800/20 to-gray-700/30" />

        {/* Rotating gears effect */}
        <div className="absolute inset-0">
          <div
            className="absolute top-1/4 left-1/6 w-40 h-40 border-2 border-white/10 rounded-full animate-spin opacity-30"
            style={{ animationDuration: "30s" }}
          >
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white/20 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-2 left-1/2 w-2 h-2 bg-white/20 rounded-full transform -translate-x-1/2" />
            <div className="absolute bottom-2 left-1/2 w-2 h-2 bg-white/20 rounded-full transform -translate-x-1/2" />
            <div className="absolute top-1/2 left-2 w-2 h-2 bg-white/20 rounded-full transform -translate-y-1/2" />
            <div className="absolute top-1/2 right-2 w-2 h-2 bg-white/20 rounded-full transform -translate-y-1/2" />
          </div>

          <div
            className="absolute bottom-1/4 right-1/6 w-32 h-32 border-2 border-white/10 rounded-full animate-spin opacity-25"
            style={{ animationDuration: "20s", animationDirection: "reverse" }}
          >
            <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white/20 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Service-themed floating elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/5 right-1/4 w-64 h-64 bg-gradient-to-r from-white/8 to-gray-300/8 rounded-full blur-3xl animate-pulse opacity-40" />
          <div
            className="absolute bottom-1/5 left-1/4 w-80 h-80 bg-gradient-to-r from-gray-300/8 to-white/8 rounded-full blur-3xl animate-pulse opacity-35"
            style={{ animationDelay: "2s" }}
          />
        </div>

        {/* Circuit-like pattern */}
        <div className="absolute inset-0 opacity-15">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
              animation: "circuit 12s linear infinite",
            }}
          />
        </div>

        {/* Tool-themed particles */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `wrenchFloat ${5 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 4}s`,
              }}
            >
              <div className="w-3 h-3 bg-white/20 rounded-sm rotate-45" />
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-3">
                <Image src="/images/xtech-logo.png" alt="Xtech Logo" width={32} height={32} className="w-8 h-8" />
                <span className="text-2xl font-bold text-white">Xtech</span>
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Início
                </Link>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Produtos
                </Link>
                <Link href="/services" className="text-white font-semibold">
                  Serviços
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button
                  variant="outline"
                  className="border-2 border-gray-600 text-white hover:border-white hover:text-white hover:bg-white/10 font-semibold transition-all duration-300 transform hover:scale-105 bg-transparent backdrop-blur-sm"
                >
                  <LogIn className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" className="hover:bg-gray-800/50">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div
            className={`transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
          >
            <Wrench className="mx-auto h-20 w-20 mb-6 text-white" />
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">SERVIÇOS</h1>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Reparamos os seus dispositivos com tecnologia avançada e garantia premium
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-1000 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">Os Nossos Serviços</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Tecnologia de ponta para reparações rápidas e eficientes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className={`group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 hover:border-white/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
                style={{ transitionDelay: `${500 + index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-gray-300/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardHeader className="text-center relative z-10">
                  <div
                    className={`mx-auto w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <service.icon className="h-8 w-8 text-black" />
                  </div>
                  <CardTitle className="text-lg text-white group-hover:text-gray-200 transition-colors duration-300">
                    {service.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-center relative z-10 space-y-4">
                  <p className="text-gray-400 leading-relaxed">{service.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-center text-sm text-gray-400">
                      <Clock className="mr-2 h-4 w-4" />
                      {service.time}
                    </div>
                    <p className="font-bold text-xl text-white">{service.price}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div
            className={`text-center mb-16 transition-all duration-1000 delay-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">Como Funciona</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Processo simples e transparente para a reparação dos seus dispositivos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Diagnóstico Avançado",
                description: "Utilizamos tecnologia de ponta para identificar todos os problemas do seu dispositivo",
                icon: Zap,
              },
              {
                step: "2",
                title: "Orçamento Transparente",
                description: "Apresentamos um orçamento detalhado sem custos ocultos ou surpresas",
                icon: Shield,
              },
              {
                step: "3",
                title: "Reparação Premium",
                description: "Reparamos com peças originais e garantia estendida de qualidade",
                icon: Award,
              },
            ].map((step, index) => (
              <div
                key={index}
                className={`group relative text-center transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
                style={{ transitionDelay: `${700 + index * 200}ms` }}
              >
                <div className="relative">
                  <div
                    className={`mx-auto w-20 h-20 rounded-full bg-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <step.icon className="h-10 w-10 text-black" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-gray-200 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-400 leading-relaxed max-w-sm mx-auto">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Form */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div
            className={`text-center mb-12 transition-all duration-1000 delay-700 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">Solicitar Reparação</h2>
            <p className="text-xl text-gray-400">Preencha o formulário e entraremos em contacto consigo</p>
          </div>

          <Card
            className={`bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 transition-all duration-1000 delay-900 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
          >
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-white">
                      Nome Completo
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-white focus:ring-white/20"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-white focus:ring-white/20"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone" className="text-white">
                      Telefone
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-white focus:ring-white/20"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="device" className="text-white">
                      Tipo de Dispositivo
                    </Label>
                    <Select value={formData.device} onValueChange={(value) => handleInputChange("device", value)}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white focus:border-white">
                        <SelectValue placeholder="Selecione o dispositivo" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="smartphone" className="text-white hover:bg-gray-700">
                          Smartphone
                        </SelectItem>
                        <SelectItem value="laptop" className="text-white hover:bg-gray-700">
                          Laptop
                        </SelectItem>
                        <SelectItem value="tablet" className="text-white hover:bg-gray-700">
                          Tablet
                        </SelectItem>
                        <SelectItem value="audio" className="text-white hover:bg-gray-700">
                          Dispositivo de Audio
                        </SelectItem>
                        <SelectItem value="other" className="text-white hover:bg-gray-700">
                          Outro
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="problem" className="text-white">
                    Problema Principal
                  </Label>
                  <Select value={formData.problem} onValueChange={(value) => handleInputChange("problem", value)}>
                    <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white focus:border-white">
                      <SelectValue placeholder="Selecione o problema" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="screen" className="text-white hover:bg-gray-700">
                        Ecrã partido/danificado
                      </SelectItem>
                      <SelectItem value="battery" className="text-white hover:bg-gray-700">
                        Problemas de bateria
                      </SelectItem>
                      <SelectItem value="charging" className="text-white hover:bg-gray-700">
                        Não carrega
                      </SelectItem>
                      <SelectItem value="software" className="text-white hover:bg-gray-700">
                        Problemas de software
                      </SelectItem>
                      <SelectItem value="water" className="text-white hover:bg-gray-700">
                        Danos por água
                      </SelectItem>
                      <SelectItem value="other" className="text-white hover:bg-gray-700">
                        Outro problema
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description" className="text-white">
                    Descrição Detalhada
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o problema em detalhe..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={4}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-white focus:ring-white/20"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-gray-200 font-bold py-4 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-white/25"
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Enviar Pedido de Reparação
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
