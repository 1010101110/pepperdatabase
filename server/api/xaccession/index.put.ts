import db from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // auth
  const user = (await getUserFromRequest(event)) as any;

  const { ID, variety, generation, pollination, quantity, description } =
    body || {};

  if (!ID) {
    throw createError({ statusCode: 400, message: "Missing accession ID" });
  }

  const [result] = await db.execute(
    `UPDATE xaccession SET
      variety = ?,
      generation = ?,
      pollination = ?,
      quantity = ?,
      description = ?,
      edit_on = NOW()
     WHERE ID = ?`,
    [variety, generation, pollination, quantity, description, ID],
  );

  addHistory(`/accessions/${ID}`,`updated accesion`, user.id)

  return {
    success: true,
    updated_rows: (result as any).affectedRows,
  };
});
