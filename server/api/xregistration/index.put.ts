import db from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // auth
  const authuser = (await getUserFromRequest(event)) as any;

  const {
    ID,
    exchange,
    user,
    region,
    wishlist,
    address,
    sent,
    received,
    returned,
  } = body || {};

  if (!ID) {
    throw createError({ statusCode: 400, message: "Missing registration ID" });
  }

  const [result] = await db.execute(
    `UPDATE xregistration SET
      exchange = ?,
      user = ?,
      region = ?,
      wishlist = ?,
      address = ?,
      sent = ?,
      received = ?,
      returned = ?,
      edit_on = NOW()
     WHERE ID = ?`,
    [
      exchange,
      user,
      region,
      wishlist,
      address,
      sent || null,
      received || null,
      returned || null,
      ID,
    ],
  );

  addHistory(`/xchange`,`updated xchange ${exchange} registration`, user.id)

  return {
    success: true,
    updated_rows: (result as any).affectedRows,
  };
});
