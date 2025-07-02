import db from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);

  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid or missing ID",
    });
  }

  const decode = decodeURIComponent(id).trim().replace("-", " ");

  const [results] = await db.execute(
    "SELECT * FROM varieties WHERE ID = ? or name = ?",
    [decode, decode],
  );

  const row = (results as any)[0];
  if (row && row.description) {
    row.description = atob(row.description);
  }
  return row;
});
