import { getRequestHeaders, createError, H3Event } from 'h3'
import db from '~/server/utils/db'

export async function getUserFromRequest(event: H3Event) {
  const headers = getRequestHeaders(event)
  const authHeader = headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Authorization header missing or invalid' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const uresult = await db.execute(`select * from user2 where id=${token}`)
    return uresult[0]
  } catch (err) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid or expired token' })
  }
}