"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminLoginRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main login page
    router.push("/auth/login")
  }, [router])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-gray-400">A redirecionar para o login...</p>
      </div>
    </div>
  )
}
