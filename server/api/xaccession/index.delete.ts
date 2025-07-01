import db from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

    // auth
    const user = await getUserFromRequest(event) as any

  const {
    ID,
    variety,
    generation,
    pollination,
    quantity,
    description
  } = body || {}

  if (!ID) {
    throw createError({ statusCode: 400, message: 'Missing accession ID' })
  }

  const [result] = await db.execute(
    `DELETE FROM xaccession
     WHERE ID = ?`,
    [ID]
  )

  return {
    success: true,
    updated_rows: (result as any).affectedRows,
  }
})