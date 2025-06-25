import db from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, attribute, description } = body

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Name is required' })
  }

  const [result]: any = await db.query(
    'INSERT INTO species (name, attribute, description) VALUES (?, ?, ?)',
    [name, attribute, description]
  )

  return result.insertid
});