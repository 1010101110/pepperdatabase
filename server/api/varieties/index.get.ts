import db from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const [results] = await db.execute('SELECT v.*, s.name as speciesname FROM varieties v join species s on s.ID = v.species');
  return results;
});