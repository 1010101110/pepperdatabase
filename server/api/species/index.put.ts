import db from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // auth
  const user = (await getUserFromRequest(event)) as any;

  const { ID, name, attribute, description } = body || {};

  if (!ID) {
    throw createError({ statusCode: 400, message: "Missing species ID" });
  }

  const codedDescription = description ? btoa(description) : null;

  const [result] = await db.execute(
    `UPDATE species SET
      name = ?,
      attribute = ?,
      description = ?
     WHERE ID = ?`,
    [name, attribute, codedDescription, ID],
  );

  return {
    success: true,
    updated_rows: (result as any).affectedRows,
  };
});
