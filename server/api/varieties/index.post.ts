import db from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, species } = body;

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: "Name is required" });
  }

  // auth
  const user = (await getUserFromRequest(event)) as any;

  const [result]: any = await db.query(
    "INSERT INTO varieties (name, species) VALUES (?, ?)",
    [name, species],
  );

  addHistory(`/varieties/${result.insertId}`,`updated variety`, user.id)

  return {
    success: true,
    insertedid: result.insertId,
  };
});
