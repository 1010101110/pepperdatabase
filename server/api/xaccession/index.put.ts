import db from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // auth
  const user = (await getUserFromRequest(event)) as any;

  const { ID, variety, generation, pollination, quantity, description, ancestor } =
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
      ancestor = ?,
      edit_on = NOW()
     WHERE ID = ?`,
    [variety, generation, pollination, quantity, description, ancestor, ID],
  );

  addHistory(`/accessions/${ID}`,`updated accession`, user.id)

  return {
    success: true,
    updated_rows: (result as any).affectedRows,
  };
});
