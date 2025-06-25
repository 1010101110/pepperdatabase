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

  const [results] = await db.execute('SELECT a.*, r.user, r.region, r.sent, r.exchange FROM xaccession a join xregistration r on r.ID = a.xregistration WHERE a.id = ?', [decode])
  const row = (results as any)[0]
  try {
    // Attempt to parse the images field
    row.images = row.images ? JSON.parse(row.images) : [];
  } catch (err) {
    console.error(`Error parsing images for row ID ${row.id}:`, err);
    row.images = []; // fallback to empty array on error
  }

  return row || {}
});