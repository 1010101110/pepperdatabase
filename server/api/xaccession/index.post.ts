import db from "~/server/utils/db";
import { getUserFromRequest } from "~/server/utils/user";

export default defineEventHandler(async (event) => {
  // auth
  const user = (await getUserFromRequest(event)) as any;

  const body = await readBody(event);

  const { xregistration } = body || {};

  if (!xregistration) {
    throw createError({
      statusCode: 400,
      message: "xregistration is required",
    });
  }

  const [result] = await db.execute(
    `INSERT INTO xaccession
            (xregistration)
            VALUES (?)`,
    [xregistration],
  );

  const insertedID = (result as any).insertId;
  let a;
  if (insertedID) {
    const [inserted] = await db.execute(
      `select * from xaccession where ID = ?`,
      [insertedID],
    );
    a = (inserted as any)[0];
    a.images = [];
  }

  addHistory(`/accessions/${insertedID}`,`added accesion`, user.id)

  return {
    success: true,
    a: a,
  };
});
