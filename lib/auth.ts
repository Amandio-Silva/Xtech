import { supabase } from "./supabase"

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
  country?: string
  is_admin: boolean
  created_at: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Login function
export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .single()

    if (error || !data) {
      return { success: false, error: "Email ou password incorretos" }
    }

    return { success: true, user: data }
  } catch (error) {
    return { success: false, error: "Erro ao fazer login" }
  }
}

// Register function
export async function register(userData: {
  name: string
  email: string
  password: string
  phone?: string
}): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", userData.email).single()

    if (existingUser) {
      return { success: false, error: "Já existe uma conta com este email" }
    }

    // Create new user
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          phone: userData.phone,
          is_admin: false,
        },
      ])
      .select()
      .single()

    if (error) {
      return { success: false, error: "Erro ao criar conta" }
    }

    return { success: true, user: data }
  } catch (error) {
    return { success: false, error: "Erro ao criar conta" }
  }
}

// Update user profile
export async function updateProfile(
  userId: string,
  userData: Partial<User>,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("users").update(userData).eq("id", userId)

    if (error) {
      return { success: false, error: "Erro ao atualizar perfil" }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: "Erro ao atualizar perfil" }
  }
}

// Get user by ID
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error || !data) {
      return null
    }

    return data
  } catch (error) {
    return null
  }
}
