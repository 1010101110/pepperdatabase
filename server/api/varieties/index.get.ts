import db from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const [results] = await db.execute('SELECT v.*, s.name as speciesname FROM varieties v JOIN species s ON s.ID = v.species');
  return results;
});