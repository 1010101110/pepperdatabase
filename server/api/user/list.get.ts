import db from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const [results] = await db.execute('SELECT id,name,bio,avatar FROM users2 where active = true');
  return results;
});