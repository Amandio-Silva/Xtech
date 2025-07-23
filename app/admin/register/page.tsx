"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminRegisterRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main register page
    router.push("/auth/register")
  }, [router])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-gray-400">A redirecionar para o registo...</p>
      </div>
    </div>
  )
}
