"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  ShoppingCart,
  BarChart3,
  LogOut,
  ClipboardList,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminPage() {
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    featured: false,
    image: "",
    description: "",
  })

  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    if (!user?.is_admin) {
      router.push("/")
      return
    }

    if (user) {
      setIsVisible(true)
      loadData()
    }
  }, [isAuthenticated, user, router])

  const loadData = async () => {
    await Promise.all([loadProducts(), loadOrders()])
    setLoading(false)
  }

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error loading products:", error)
    }
  }

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          users (name, email),
          order_items (
            *,
            products (name, image_url)
          )
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error("Error loading orders:", error)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const stats = [
    {
      title: "Total de Produtos",
      value: products.length,
      icon: Package,
      change: "+12%",
    },
    {
      title: "Pedidos Totais",
      value: orders.length,
      icon: ClipboardList,
      change: "+18%",
    },
    {
      title: "Vendas Totais",
      value: `€${orders.reduce((acc, order) => acc + Number.parseFloat(order.total_amount || 0), 0).toFixed(2)}`,
      icon: TrendingUp,
      change: "+23%",
    },
    {
      title: "Stock Total",
      value: products.reduce((acc, p) => acc + (p.stock || 0), 0),
      icon: ShoppingCart,
      change: "-5%",
    },
  ]

  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.price && newProduct.category) {
      try {
        const { data, error } = await supabase
          .from("products")
          .insert([
            {
              name: newProduct.name,
              price: Number.parseFloat(newProduct.price),
              category: newProduct.category,
              stock: Number.parseInt(newProduct.stock) || 0,
              featured: newProduct.featured,
              image_url: newProduct.image || null,
              description: newProduct.description || null,
              original_price: null,
              is_new: false,
              rating: 0,
              sales: 0,
            },
          ])
          .select()
          .single()

        if (error) throw error

        setProducts([data, ...products])
        setNewProduct({
          name: "",
          price: "",
          category: "",
          stock: "",
          featured: false,
          image: "",
          description: "",
        })
        setIsAddingProduct(false)
      } catch (error) {
        console.error("Error adding product:", error)
        alert("Erro ao adicionar produto")
      }
    }
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString(),
      featured: product.featured,
      image: product.image_url || "",
      description: product.description || "",
    })
  }

  const handleUpdateProduct = async () => {
    if (editingProduct && newProduct.name && newProduct.price && newProduct.category) {
      try {
        const { data, error } = await supabase
          .from("products")
          .update({
            name: newProduct.name,
            price: Number.parseFloat(newProduct.price),
            category: newProduct.category,
            stock: Number.parseInt(newProduct.stock) || 0,
            featured: newProduct.featured,
            image_url: newProduct.image || editingProduct.image_url,
            description: newProduct.description || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingProduct.id)
          .select()
          .single()

        if (error) throw error

        setProducts(products.map((p) => (p.id === editingProduct.id ? data : p)))
        setEditingProduct(null)
        setNewProduct({
          name: "",
          price: "",
          category: "",
          stock: "",
          featured: false,
          image: "",
          description: "",
        })
      } catch (error) {
        console.error("Error updating product:", error)
        alert("Erro ao atualizar produto")
      }
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Tem a certeza que deseja eliminar este produto?")) {
      try {
        const { error } = await supabase.from("products").delete().eq("id", id)

        if (error) throw error

        setProducts(products.filter((p) => p.id !== id))
      } catch (error) {
        console.error("Error deleting product:", error)
        alert("Erro ao eliminar produto")
      }
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          status: status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId)

      if (error) throw error

      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status } : order)))
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Erro ao atualizar status do pedido")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400"
      case "processing":
        return "bg-blue-500/20 text-blue-400"
      case "completed":
        return "bg-green-500/20 text-green-400"
      case "cancelled":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "processing":
        return <Package className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">A verificar autenticação...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Admin Dashboard Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/40 via-gray-800/30 to-gray-700/40" />
        <div className="absolute inset-0">
          <div
            className="absolute top-1/4 left-1/5 w-48 h-48 border border-white/10 rounded-lg animate-pulse opacity-20"
            style={{ animationDuration: "4s" }}
          />
          <div
            className="absolute top-1/2 right-1/5 w-32 h-32 border border-white/10 rounded-full animate-pulse opacity-15"
            style={{ animationDuration: "6s", animationDelay: "2s" }}
          />
        </div>
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 bg-white/20"
              style={{
                left: `${10 + i * 10}%`,
                width: "20px",
                height: `${20 + Math.random() * 60}%`,
                animation: `barGrow ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-50 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Image src="/images/xtech-logo.png" alt="Xtech Logo" width={32} height={32} className="w-8 h-8" />
              <div className="text-2xl font-bold text-white">Xtech Admin</div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="hover:bg-gray-800/50 text-gray-300 hover:text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
              <Link href="/">
                <Button variant="ghost" className="hover:bg-gray-800/50">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar à Loja
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Hero */}
        <div
          className={`text-center mb-12 transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">PAINEL ADMIN</h1>
          <p className="text-xl text-gray-400">Gerir produtos, encomendas e monitorizar vendas</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className={`group relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50 hover:border-white/50 transition-all duration-500 transform hover:scale-105 overflow-hidden ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-gray-300/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <stat.icon className="h-6 w-6 text-black" />
                  </div>
                  <Badge
                    className={`${stat.change.startsWith("+") ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"} border-0`}
                  >
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="products" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="products" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <Package className="mr-2 h-4 w-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <ClipboardList className="mr-2 h-4 w-4" />
              Encomendas
            </TabsTrigger>
          </TabsList>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-white flex items-center">
                    <BarChart3 className="mr-3 h-6 w-6 text-white" />
                    Gestão de Produtos
                  </CardTitle>
                  <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
                    <DialogTrigger asChild>
                      <Button className="bg-white text-black hover:bg-gray-200 font-semibold transition-all duration-300 transform hover:scale-105">
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Produto
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-gray-800 border-gray-600">
                      <DialogHeader>
                        <DialogTitle className="text-white">Adicionar Novo Produto</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name" className="text-white">
                            Nome do Produto
                          </Label>
                          <Input
                            id="name"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="price" className="text-white">
                            Preço (€)
                          </Label>
                          <Input
                            id="price"
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category" className="text-white">
                            Categoria
                          </Label>
                          <Select
                            value={newProduct.category}
                            onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-800 border-gray-600">
                              <SelectItem value="Smartphones" className="text-white hover:bg-gray-700">
                                Smartphones
                              </SelectItem>
                              <SelectItem value="Laptops" className="text-white hover:bg-gray-700">
                                Laptops
                              </SelectItem>
                              <SelectItem value="Tablets" className="text-white hover:bg-gray-700">
                                Tablets
                              </SelectItem>
                              <SelectItem value="Audio" className="text-white hover:bg-gray-700">
                                Audio
                              </SelectItem>
                              <SelectItem value="Wearables" className="text-white hover:bg-gray-700">
                                Wearables
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="stock" className="text-white">
                            Stock
                          </Label>
                          <Input
                            id="stock"
                            type="number"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="image" className="text-white">
                            URL da Imagem
                          </Label>
                          <Input
                            id="image"
                            type="url"
                            value={newProduct.image}
                            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="https://exemplo.com/imagem.jpg"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description" className="text-white">
                            Descrição
                          </Label>
                          <Input
                            id="description"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="Descrição do produto"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="featured"
                            checked={newProduct.featured}
                            onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                            className="rounded"
                          />
                          <Label htmlFor="featured" className="text-white">
                            Produto em Destaque
                          </Label>
                        </div>
                        <Button onClick={handleAddProduct} className="w-full bg-white text-black hover:bg-gray-200">
                          Adicionar Produto
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Imagem</TableHead>
                        <TableHead className="text-gray-300">Nome</TableHead>
                        <TableHead className="text-gray-300">Categoria</TableHead>
                        <TableHead className="text-gray-300">Preço</TableHead>
                        <TableHead className="text-gray-300">Stock</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id} className="border-gray-700 hover:bg-gray-800/50">
                          <TableCell>
                            <Image
                              src={product.image_url || "/placeholder.svg"}
                              alt={product.name}
                              width={50}
                              height={50}
                              className="rounded object-cover"
                            />
                          </TableCell>
                          <TableCell className="font-medium text-white">{product.name}</TableCell>
                          <TableCell className="text-gray-300">{product.category}</TableCell>
                          <TableCell className="text-white font-semibold">€{product.price}</TableCell>
                          <TableCell className="text-gray-300">{product.stock}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {product.featured && (
                                <Badge className="bg-white/20 text-white border-white/30">Destaque</Badge>
                              )}
                              {product.stock === 0 && (
                                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Sem Stock</Badge>
                              )}
                              {product.stock > 0 && product.stock <= 5 && (
                                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                                  Stock Baixo
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditProduct(product)}
                                    className="hover:bg-gray-700 text-white hover:text-gray-200"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md bg-gray-800 border-gray-600">
                                  <DialogHeader>
                                    <DialogTitle className="text-white">Editar Produto</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="edit-name" className="text-white">
                                        Nome do Produto
                                      </Label>
                                      <Input
                                        id="edit-name"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        className="bg-gray-700 border-gray-600 text-white"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-price" className="text-white">
                                        Preço (€)
                                      </Label>
                                      <Input
                                        id="edit-price"
                                        type="number"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        className="bg-gray-700 border-gray-600 text-white"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-category" className="text-white">
                                        Categoria
                                      </Label>
                                      <Select
                                        value={newProduct.category}
                                        onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                                      >
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-800 border-gray-600">
                                          <SelectItem value="Smartphones" className="text-white hover:bg-gray-700">
                                            Smartphones
                                          </SelectItem>
                                          <SelectItem value="Laptops" className="text-white hover:bg-gray-700">
                                            Laptops
                                          </SelectItem>
                                          <SelectItem value="Tablets" className="text-white hover:bg-gray-700">
                                            Tablets
                                          </SelectItem>
                                          <SelectItem value="Audio" className="text-white hover:bg-gray-700">
                                            Audio
                                          </SelectItem>
                                          <SelectItem value="Wearables" className="text-white hover:bg-gray-700">
                                            Wearables
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-stock" className="text-white">
                                        Stock
                                      </Label>
                                      <Input
                                        id="edit-stock"
                                        type="number"
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        className="bg-gray-700 border-gray-600 text-white"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-image" className="text-white">
                                        URL da Imagem
                                      </Label>
                                      <Input
                                        id="edit-image"
                                        type="url"
                                        value={newProduct.image}
                                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                        className="bg-gray-700 border-gray-600 text-white"
                                        placeholder="https://exemplo.com/imagem.jpg"
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="edit-description" className="text-white">
                                        Descrição
                                      </Label>
                                      <Input
                                        id="edit-description"
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                        className="bg-gray-700 border-gray-600 text-white"
                                        placeholder="Descrição do produto"
                                      />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        id="edit-featured"
                                        checked={newProduct.featured}
                                        onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                                        className="rounded"
                                      />
                                      <Label htmlFor="edit-featured" className="text-white">
                                        Produto em Destaque
                                      </Label>
                                    </div>
                                    <Button
                                      onClick={handleUpdateProduct}
                                      className="w-full bg-white text-black hover:bg-gray-200"
                                    >
                                      Atualizar Produto
                                    </Button>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProduct(product.id)}
                                className="hover:bg-gray-700 text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <ClipboardList className="mr-3 h-6 w-6 text-white" />
                  Gestão de Encomendas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Nº Pedido</TableHead>
                        <TableHead className="text-gray-300">Cliente</TableHead>
                        <TableHead className="text-gray-300">Data</TableHead>
                        <TableHead className="text-gray-300">Total</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id} className="border-gray-700 hover:bg-gray-800/50">
                          <TableCell className="font-medium text-white">{order.order_number}</TableCell>
                          <TableCell className="text-gray-300">
                            <div>
                              <p className="font-medium">{order.users?.name}</p>
                              <p className="text-sm text-gray-400">{order.users?.email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(order.created_at).toLocaleDateString("pt-PT")}
                          </TableCell>
                          <TableCell className="text-white font-semibold">€{order.total_amount}</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(order.status)} border-0 flex items-center gap-1`}>
                              {getStatusIcon(order.status)}
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setSelectedOrder(order)}
                                    className="hover:bg-gray-700 text-white hover:text-gray-200"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl bg-gray-800 border-gray-600 max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="text-white">
                                      Detalhes do Pedido #{order.order_number}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-semibold text-white mb-2">Informações do Cliente</h4>
                                        <p className="text-gray-300">{order.users?.name}</p>
                                        <p className="text-gray-400">{order.users?.email}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold text-white mb-2">Informações do Pedido</h4>
                                        <p className="text-gray-300">
                                          Data: {new Date(order.created_at).toLocaleDateString("pt-PT")}
                                        </p>
                                        <p className="text-gray-300">Total: €{order.total_amount}</p>
                                      </div>
                                    </div>

                                    {order.shipping_address && (
                                      <div>
                                        <h4 className="font-semibold text-white mb-2">Endereço de Entrega</h4>
                                        <p className="text-gray-300">{order.shipping_address}</p>
                                      </div>
                                    )}

                                    <div>
                                      <h4 className="font-semibold text-white mb-2">Itens do Pedido</h4>
                                      <div className="space-y-2">
                                        {order.order_items?.map((item: any) => (
                                          <div
                                            key={item.id}
                                            className="flex items-center space-x-3 border border-gray-700 rounded p-3"
                                          >
                                            <Image
                                              src={item.products?.image_url || "/placeholder.svg"}
                                              alt={item.products?.name}
                                              width={50}
                                              height={50}
                                              className="rounded object-cover"
                                            />
                                            <div className="flex-1">
                                              <p className="text-white font-medium">{item.products?.name}</p>
                                              <p className="text-gray-400">Quantidade: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                              <p className="text-white">€{item.unit_price}</p>
                                              <p className="text-gray-400">Total: €{item.total_price}</p>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                      <Label className="text-white">Atualizar Status:</Label>
                                      <Select
                                        value={order.status}
                                        onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                                      >
                                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-gray-800 border-gray-600">
                                          <SelectItem value="pending" className="text-white hover:bg-gray-700">
                                            Pendente
                                          </SelectItem>
                                          <SelectItem value="processing" className="text-white hover:bg-gray-700">
                                            Em Processamento
                                          </SelectItem>
                                          <SelectItem value="completed" className="text-white hover:bg-gray-700">
                                            Concluído
                                          </SelectItem>
                                          <SelectItem value="cancelled" className="text-white hover:bg-gray-700">
                                            Cancelado
                                          </SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              <Select
                                value={order.status}
                                onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                              >
                                <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-gray-800 border-gray-600">
                                  <SelectItem value="pending" className="text-white hover:bg-gray-700">
                                    Pendente
                                  </SelectItem>
                                  <SelectItem value="processing" className="text-white hover:bg-gray-700">
                                    Processando
                                  </SelectItem>
                                  <SelectItem value="completed" className="text-white hover:bg-gray-700">
                                    Concluído
                                  </SelectItem>
                                  <SelectItem value="cancelled" className="text-white hover:bg-gray-700">
                                    Cancelado
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {orders.length === 0 && (
                    <div className="text-center py-12">
                      <ClipboardList className="mx-auto h-16 w-16 text-gray-600 mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">Nenhuma encomenda encontrada</h3>
                      <p className="text-gray-400">As encomendas aparecerão aqui quando os clientes fizerem pedidos</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
