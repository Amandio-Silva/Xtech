"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, ShoppingBag, FileText, Settings, LogOut, Edit, Save, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { updateProfile } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

export default function ProfilePage() {
  const { user, isAuthenticated, logout, updateUser } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [cart, setCart] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    if (user) {
      setEditForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        postal_code: user.postal_code || "",
        country: user.country || "Portugal",
      })
      loadUserData()
    }
  }, [isAuthenticated, user, router])

  const loadUserData = async () => {
    if (!user) return

    try {
      // Load orders
      const { data: ordersData } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            *,
            products (name, image_url)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      setOrders(ordersData || [])

      // Load cart
      const { data: cartData } = await supabase
        .from("cart")
        .select(`
          *,
          products (*)
        `)
        .eq("user_id", user.id)

      setCart(cartData || [])
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return

    const result = await updateProfile(user.id, editForm)

    if (result.success) {
      updateUser({ ...user, ...editForm })
      setIsEditing(false)
    } else {
      alert(result.error || "Erro ao atualizar perfil")
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const removeFromCart = async (cartItemId: string) => {
    try {
      await supabase.from("cart").delete().eq("id", cartItemId)

      setCart(cart.filter((item) => item.id !== cartItemId))
    } catch (error) {
      console.error("Error removing from cart:", error)
    }
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">A carregar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
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
      <header className="relative z-50 border-b border-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <Image src="/images/xtech-logo.png" alt="Xtech Logo" width={32} height={32} className="w-8 h-8" />
              <span className="text-2xl font-bold text-white">Xtech</span>
            </Link>
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
                  Voltar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">MEU PERFIL</h1>
          <p className="text-xl text-gray-400">Bem-vindo, {user.name}!</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <User className="mr-2 h-4 w-4" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="cart" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <FileText className="mr-2 h-4 w-4" />
              Carrinho
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-black">
              <Settings className="mr-2 h-4 w-4" />
              Definições
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl text-white">Informações Pessoais</CardTitle>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="bg-white text-black hover:bg-gray-200">
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700">
                        <Save className="mr-2 h-4 w-4" />
                        Guardar
                      </Button>
                      <Button
                        onClick={() => setIsEditing(false)}
                        variant="outline"
                        className="border-gray-600 text-white hover:bg-gray-800"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-white">
                      Nome Completo
                    </Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="bg-gray-800/50 border-gray-600 text-white"
                      />
                    ) : (
                      <p className="text-gray-300 mt-1">{user.name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="bg-gray-800/50 border-gray-600 text-white"
                      />
                    ) : (
                      <p className="text-gray-300 mt-1">{user.email}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-white">
                      Telefone
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="bg-gray-800/50 border-gray-600 text-white"
                      />
                    ) : (
                      <p className="text-gray-300 mt-1">{user.phone || "Não definido"}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-white">
                      Cidade
                    </Label>
                    {isEditing ? (
                      <Input
                        id="city"
                        value={editForm.city}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        className="bg-gray-800/50 border-gray-600 text-white"
                      />
                    ) : (
                      <p className="text-gray-300 mt-1">{user.city || "Não definido"}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="address" className="text-white">
                    Morada
                  </Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="bg-gray-800/50 border-gray-600 text-white"
                    />
                  ) : (
                    <p className="text-gray-300 mt-1">{user.address || "Não definido"}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Histórico de Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="mx-auto h-16 w-16 text-gray-600 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Nenhum pedido encontrado</h3>
                    <p className="text-gray-400">Ainda não fez nenhuma compra</p>
                    <Link href="/products">
                      <Button className="mt-4 bg-white text-black hover:bg-gray-200">Explorar Produtos</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">Pedido #{order.order_number}</h3>
                            <p className="text-gray-400">{new Date(order.created_at).toLocaleDateString("pt-PT")}</p>
                          </div>
                          <div className="text-right">
                            <Badge
                              className={`${
                                order.status === "completed"
                                  ? "bg-green-500/20 text-green-400"
                                  : order.status === "processing"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-gray-500/20 text-gray-400"
                              }`}
                            >
                              {order.status}
                            </Badge>
                            <p className="text-xl font-bold text-white mt-1">€{order.total_amount}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {order.order_items?.map((item: any) => (
                            <div key={item.id} className="flex items-center space-x-3 text-gray-300">
                              <span>{item.quantity}x</span>
                              <span>{item.products?.name}</span>
                              <span className="ml-auto">€{item.total_price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cart Tab */}
          <TabsContent value="cart">
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Carrinho de Compras</CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-16 w-16 text-gray-600 mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">Carrinho vazio</h3>
                    <p className="text-gray-400">Adicione produtos ao seu carrinho</p>
                    <Link href="/products">
                      <Button className="mt-4 bg-white text-black hover:bg-gray-200">Explorar Produtos</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 border border-gray-700 rounded-lg p-4">
                        <Image
                          src={item.products?.image_url || "/placeholder.svg"}
                          alt={item.products?.name}
                          width={80}
                          height={80}
                          className="rounded object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white">{item.products?.name}</h3>
                          <p className="text-gray-400">Quantidade: {item.quantity}</p>
                          <p className="text-xl font-bold text-white">
                            €{(item.products?.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <Button
                          onClick={() => removeFromCart(item.id)}
                          variant="outline"
                          className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
                    <div className="border-t border-gray-700 pt-4">
                      <div className="flex items-center justify-between text-xl font-bold text-white">
                        <span>Total:</span>
                        <span>
                          €{cart.reduce((total, item) => total + item.products?.price * item.quantity, 0).toFixed(2)}
                        </span>
                      </div>
                      <Button className="w-full mt-4 bg-white text-black hover:bg-gray-200 font-semibold py-3">
                        Finalizar Compra
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border border-gray-700/50">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Definições da Conta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Informações da Conta</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Membro desde:</span>
                      <p className="text-white">{new Date(user.created_at).toLocaleDateString("pt-PT")}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Tipo de conta:</span>
                      <p className="text-white">{user.is_admin ? "Administrador" : "Cliente"}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Ações da Conta</h3>
                  <div className="space-y-3">
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full border-red-600 text-red-400 hover:bg-red-600 hover:text-white bg-transparent"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Terminar Sessão
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
