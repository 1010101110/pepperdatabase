import db from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const [results] = await db.execute(`
    select h.*, u.user_name, u2.name
    from history h
    left join users u on u.user_id = h.action_by
    left join users2 u2 on u2.id = h.action_by
    order by h.ID desc
    limit 100
    `);
  return results;
});