import db from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // auth
  const user = (await getUserFromRequest(event)) as any;

  const { id, name, email, bio } = body || {};

  const [result] = await db.execute(
    `UPDATE users2 SET
      name = ?,
      email = ?,
      bio = ?
     WHERE id = ?`,
    [name, email, bio, id],
  );

  return {
    success: true,
    updated_rows: (result as any).affectedRows,
  };
});
