import db from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const [results] = await db.execute('SELECT * FROM xchange');
  return results;
});