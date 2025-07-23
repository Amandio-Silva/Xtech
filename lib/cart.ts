import { supabase } from "./supabase"

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  products: {
    id: string
    name: string
    price: number
    image_url: string
    stock: number
  }
}

// Get cart items for user
export async function getCartItems(userId: string): Promise<CartItem[]> {
  try {
    const { data, error } = await supabase
      .from("cart")
      .select(`
        *,
        products (
          id,
          name,
          price,
          image_url,
          stock
        )
      `)
      .eq("user_id", userId)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting cart items:", error)
    return []
  }
}

// Add item to cart
export async function addToCart(userId: string, productId: string, quantity = 1) {
  try {
    // Check if item already exists
    const { data: existingItem } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .single()

    if (existingItem) {
      // Update quantity
      const { error } = await supabase
        .from("cart")
        .update({
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingItem.id)

      if (error) throw error
      return { success: true }
    } else {
      // Add new item
      const { error } = await supabase.from("cart").insert([
        {
          user_id: userId,
          product_id: productId,
          quantity: quantity,
        },
      ])

      if (error) throw error
      return { success: true }
    }
  } catch (error) {
    console.error("Error adding to cart:", error)
    return { success: false, error: "Erro ao adicionar ao carrinho" }
  }
}

// Update cart item quantity
export async function updateCartQuantity(cartItemId: string, quantity: number) {
  try {
    if (quantity <= 0) {
      return removeFromCart(cartItemId)
    }

    const { error } = await supabase
      .from("cart")
      .update({
        quantity: quantity,
        updated_at: new Date().toISOString(),
      })
      .eq("id", cartItemId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Error updating cart quantity:", error)
    return { success: false, error: "Erro ao atualizar quantidade" }
  }
}

// Remove item from cart
export async function removeFromCart(cartItemId: string) {
  try {
    const { error } = await supabase.from("cart").delete().eq("id", cartItemId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Error removing from cart:", error)
    return { success: false, error: "Erro ao remover do carrinho" }
  }
}

// Clear entire cart
export async function clearCart(userId: string) {
  try {
    const { error } = await supabase.from("cart").delete().eq("user_id", userId)

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error("Error clearing cart:", error)
    return { success: false, error: "Erro ao limpar carrinho" }
  }
}

// Create order from cart
export async function createOrderFromCart(userId: string, shippingAddress: string) {
  try {
    // Get cart items
    const cartItems = await getCartItems(userId)
    if (cartItems.length === 0) {
      return { success: false, error: "Carrinho vazio" }
    }

    // Calculate total
    const totalAmount = cartItems.reduce((total, item) => total + item.products.price * item.quantity, 0)

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId,
          order_number: orderNumber,
          total_amount: totalAmount,
          shipping_address: shippingAddress,
          status: "pending",
        },
      ])
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.products.price,
      total_price: item.products.price * item.quantity,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) throw itemsError

    // Clear cart
    await clearCart(userId)

    return { success: true, order }
  } catch (error) {
    console.error("Error creating order:", error)
    return { success: false, error: "Erro ao criar pedido" }
  }
}
