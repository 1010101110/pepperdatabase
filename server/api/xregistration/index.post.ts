import db from "~/server/utils/db";
import { getUserFromRequest } from "~/server/utils/user";

export default defineEventHandler(async (event) => {
  // auth
  const user = (await getUserFromRequest(event)) as any;

  //body
  const body = await readBody(event);
  const { exchange, region } = body || {};

  const [resulti] = await db.execute(
    `INSERT INTO xregistration
            (ID, exchange,region,email,user)
            VALUES (UUID(),?,?,?,?);
        `,
    [exchange, region, user.email, user.name],
  );

  const [result] = await db.execute(
    "SELECT * FROM xregistration WHERE exchange = ? and email = ?; ",
    [exchange, user.email],
  );

  addHistory(`/xchange`,`registered for xchange ${exchange} ${region}`, user.id)

  return {
    success: true,
    result,
  };
});
