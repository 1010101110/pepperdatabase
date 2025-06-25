import db from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid or missing ID'
    })
  }

  const decode = decodeURIComponent(id).trim();

  const [results] = await db.execute('SELECT * FROM species WHERE id = ? or name = ?', [decode,decode])

  return (results as any)[0] || {}
});