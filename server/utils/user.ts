import { getCookie, H3Event, createError } from 'h3'
import db from '~/server/utils/db'

export async function getUserFromRequest(event: H3Event) {
  //token from cookie
  const token = getCookie(event, 'auth_token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  //check db
  const [results] = await db.execute('SELECT * FROM users2 WHERE activation_hash = ?', [token]) as any
  const user = results?.[0]
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid user' })
  }

  return user
}