import db from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { name, attribute } = body;

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: "Name is required" });
  }

  // auth
  const user = (await getUserFromRequest(event)) as any;


  const [result]: any = await db.query(
    "INSERT INTO species (name, attribute) VALUES (?, ?)",
    [name, attribute],
  );

  addHistory(`/species/${result.insertId}`,`added species`, user.id)

  return {
    success: true,
    insertedid: result.insertId,
  };
});
