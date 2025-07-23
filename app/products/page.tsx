"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  ShoppingCart,
  Star,
  ArrowLeft,
  Zap,
  Heart,
  LogIn,
  Package,
  User,
  Plus,
  Minus,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { addToCart, getCartItems, updateCartQuantity, removeFromCart, createOrderFromCart } from "@/lib/cart"
import type { CartItem } from "@/lib/cart"

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(false)
  const [loading, setLoading] = useState(true)
  const [cartOpen, setCartOpen] = useState(false)
  const [shippingAddress, setShippingAddress] = useState("")

  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)
    loadProducts()
    if (user) {
      loadCartItems()
    }
  }, [user])

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error loading products:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadCartItems = async () => {
    if (!user) return
    const items = await getCartItems(user.id)
    setCartItems(items)
  }

  const categories = ["all", "Smartphones", "Laptops", "Tablets", "Audio", "Wearables"]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const calculateDiscount = (price: number, originalPrice: number | null) => {
    if (!originalPrice || originalPrice <= price) return 0
    return Math.round(((originalPrice - price) / originalPrice) * 100)
  }

  const handleAddToCart = async (productId: string) => {
    if (!isAuthenticated || !user) {
      router.push("/auth/login")
      return
    }

    const result = await addToCart(user.id, productId, 1)
    if (result.success) {
      await loadCartItems()
    } else {
      alert(result.error || "Erro ao adicionar ao carrinho")
    }
  }

  const handleUpdateQuantity = async (cartItemId: string, quantity: number) => {
    const result = await updateCartQuantity(cartItemId, quantity)
    if (result.success) {
      await loadCartItems()
    }
  }

  const handleRemoveFromCart = async (cartItemId: string) => {
    const result = await removeFromCart(cartItemId)
    if (result.success) {
      await loadCartItems()
    }
  }

  const handleCheckout = async () => {
    if (!user || !shippingAddress.trim()) {
      alert("Por favor, preencha o endereço de entrega")
      return
    }

    const result = await createOrderFromCart(user.id, shippingAddress)
    if (result.success) {
      alert("Pedido criado com sucesso!")
      setCartOpen(false)
      setShippingAddress("")
      await loadCartItems()
    } else {
      alert(result.error || "Erro ao criar pedido")
    }
  }

  const cartTotal = cartItems.reduce((total, item) => total + item.products.price * item.quantity, 0)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">A carregar produtos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/30 via-gray-800/20 to-gray-700/30" />
        <div className="absolute inset-0">
          <div
            className="absolute top-20 left-20 w-32 h-32 border border-white/10 rotate-45 animate-spin opacity-30"
            style={{ animationDuration: "20s" }}
          />
          <div
            className="absolute top-40 right-40 w-24 h-24 border border-white/10 rotate-12 animate-spin opacity-20"
            style={{ animationDuration: "15s", animationDirection: "reverse" }}
          />
        </div>
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/5 w-72 h-72 bg-gradient-to-r from-white/8 to-gray-300/8 rounded-full blur-3xl animate-pulse opacity-50" />
          <div
            className="absolute bottom-1/3 right-1/5 w-96 h-96 bg-gradient-to-r from-gray-300/8 to-white/8 rounded-full blur-3xl animate-pulse opacity-40"
            style={{ animationDelay: "3s" }}
          />
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
                <Link href="/products" className="text-white font-semibold">
                  Produtos
                </Link>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors duration-300">
                  Serviços
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <Dialog open={cartOpen} onOpenChange={setCartOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-gray-800/50">
                    <ShoppingCart className="h-5 w-5" />
                    {cartItems.length > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-white text-black">
                        {cartItems.reduce((total, item) => total + item.quantity, 0)}
                      </Badge>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-gray-800 border-gray-600 max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-white">Carrinho de Compras</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {cartItems.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingCart className="mx-auto h-16 w-16 text-gray-600 mb-4" />
                        <p className="text-gray-400">Carrinho vazio</p>
                      </div>
                    ) : (
                      <>
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-4 border border-gray-700 rounded-lg p-4"
                          >
                            <Image
                              src={item.products.image_url || "/placeholder.svg"}
                              alt={item.products.name}
                              width={60}
                              height={60}
                              className="rounded object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{item.products.name}</h3>
                              <p className="text-gray-400">€{item.products.price}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                className="border-gray-600 text-white hover:bg-gray-700"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-white w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                className="border-gray-600 text-white hover:bg-gray-700"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-white">
                                €{(item.products.price * item.quantity).toFixed(2)}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFromCart(item.id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                Remover
                              </Button>
                            </div>
                          </div>
                        ))}
                        <div className="border-t border-gray-700 pt-4">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-xl font-bold text-white">Total: €{cartTotal.toFixed(2)}</span>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-white mb-2">Endereço de Entrega</label>
                              <Input
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                placeholder="Digite seu endereço completo"
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                            <Button
                              onClick={handleCheckout}
                              className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-3"
                            >
                              Finalizar Compra
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {/* User Menu */}
              {isAuthenticated && user ? (
                <div className="flex items-center space-x-2">
                  <Link href="/profile">
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
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">PRODUTOS</h1>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Descubra a nossa coleção exclusiva de tecnologia de última geração
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="relative z-10 px-6 mb-12">
        <div className="max-w-7xl mx-auto">
          <div
            className={`flex flex-col lg:flex-row gap-6 p-6 rounded-2xl bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border border-gray-700/50 transition-all duration-1000 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Pesquisar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-white focus:ring-white/20"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-64 bg-gray-800/50 border-gray-600 text-white focus:border-white">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {categories.map((category) => (
                  <SelectItem key={category} value={category} className="text-white hover:bg-gray-700">
                    {category === "all" ? "Todas as Categorias" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => {
              const discount = calculateDiscount(product.price, product.original_price)

              return (
                <Card
                  key={product.id}
                  className={`group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 hover:border-white/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 overflow-hidden ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
                  style={{ transitionDelay: `${500 + index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-gray-300/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    {product.is_new && (
                      <Badge className="bg-white text-black border-0">
                        <Zap className="w-3 h-3 mr-1" />
                        NOVO
                      </Badge>
                    )}
                    {discount > 0 && <Badge className="bg-gray-800 text-white border-0">-{discount}%</Badge>}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart
                      className={`h-4 w-4 transition-colors duration-300 ${
                        favorites.includes(product.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400 hover:text-red-400"
                      }`}
                    />
                  </Button>

                  <CardContent className="p-6 relative z-10">
                    <div className="relative mb-6 overflow-hidden rounded-xl">
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        width={400}
                        height={400}
                        className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="space-y-3">
                      <Badge variant="secondary" className="bg-gray-700/50 text-white border-gray-500/30">
                        {product.category}
                      </Badge>

                      <h3 className="text-xl font-bold text-white group-hover:text-gray-200 transition-colors duration-300">
                        {product.name}
                      </h3>

                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(product.rating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-600"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-400">({product.rating || 0})</span>
                      </div>

                      <p className="text-sm text-gray-400">
                        Stock:{" "}
                        <span className={product.stock < 10 ? "text-red-400" : "text-green-400"}>
                          {product.stock} unidades
                        </span>
                      </p>

                      {product.description && (
                        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="px-6 pb-6 relative z-10">
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          {product.original_price && product.original_price > product.price && (
                            <span className="text-sm text-gray-400 line-through">€{product.original_price}</span>
                          )}
                          <div className="text-2xl font-bold text-white">€{product.price}</div>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={product.stock === 0}
                        className="w-full bg-white text-black hover:bg-gray-200 font-semibold transition-all duration-300 transform hover:scale-105 group-hover:shadow-lg group-hover:shadow-white/25 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {product.stock === 0 ? "Sem Stock" : "Adicionar ao Carrinho"}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <Package className="mx-auto h-20 w-20 text-gray-600 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-400">Tente ajustar os filtros de pesquisa</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
