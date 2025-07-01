import db from '~/server/utils/db'
import {getUserFromRequest} from '~/server/utils/user'

export default defineEventHandler(async (event) => {
  const [results] = await db.execute('SELECT exchange FROM xchange where active = true');
  const row = (results as any)[0]
  return row?.exchange;
});