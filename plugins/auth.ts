import { defineNuxtPlugin, useFetch, useRequestHeaders } from "nuxt/app"
import { useAuth } from "../composables/auth"

export default defineNuxtPlugin(async (nuxtApp) => {
  const token = getCookieFromRequest();
  if(token){
    const { data } = await useFetch('/api/user/login', {method:'POST',body:{activation_hash:token}})

    if (data.value) {
      const { setUser } = useAuth()
      setUser(data.value)
    }
  }
})

function getCookieFromRequest() {
  if (process.server) {
    // SSR: read cookie from request headers
    const headers = useRequestHeaders(['cookie'])
    const cookieHeader = headers.cookie || ''
    const token = parseTokenFromCookieHeader(cookieHeader)
    return token
  } else if (process.client) {
    // Client: use document.cookie
    const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]*)/)
    return match?.[1] || null
  }

  return null
}

function parseTokenFromCookieHeader(cookieHeader: string) {
  const match = cookieHeader.match(/(?:^|;\s*)auth_token=([^;]*)/)
  return match?.[1] || null
}