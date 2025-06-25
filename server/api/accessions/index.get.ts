import db from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const [results] = await db.execute('SELECT * FROM xaccession');
  if (results && (results as any[]).length > 0) {
    const parsedResults = (results as any[]).map(row => {
      try {
        // Attempt to parse the images field
        row.images = row.images ? JSON.parse(row.images) : [];
      } catch (err) {
        console.error(`Error parsing images for row ID ${row.id}:`, err);
        row.images = []; // fallback to empty array on error
      }
      return row;
    });

    return parsedResults;
  } else {
    return []
  }
});