import db from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const [results] = await db.execute("SELECT * FROM species");
  return results;
});
