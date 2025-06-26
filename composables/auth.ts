import { useState } from "nuxt/app"

export const useAuth = () => {
  const user = useState('auth_user', () => null)

  const setUser = (data: any) => {
    user.value = data
  }

  const clearUser = () => {
    user.value = null
  }

  return { user, setUser, clearUser }
}