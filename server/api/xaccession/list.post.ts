import { ar } from "vuetify/locale";
import db from "~/server/utils/db";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { region, exchange, sortBy, filters } = body || {};

  // Build WHERE clause
  let whereConditions = ['r.region = ?', 'r.exchange = ?', 'a.images is not null'];
  let params: any[] = [region, exchange];

  // Add filters if provided
  if (filters) {
    if (filters.variety) {
      whereConditions.push('a.variety LIKE ?');
      params.push(`%${filters.variety}%`);
    }
    if (filters.user) {
      whereConditions.push('r.user = ?');
      params.push(filters.user);
    }
    if (filters.generation) {
      whereConditions.push('a.generation LIKE ?');
      params.push(`%${filters.generation}%`);
    }
    if (filters.pollination) {
      whereConditions.push('a.pollination LIKE ?');
      params.push(`%${filters.pollination}%`);
    }
  }

  // Build ORDER BY clause
  let orderBy = 'a.ID DESC'; // default
  if (sortBy) {
    switch (sortBy) {
      case 'newest':
        orderBy = 'a.ID DESC';
        break;
      case 'oldest':
        orderBy = 'a.ID ASC';
        break;
      case 'variety-asc':
        orderBy = 'a.variety ASC';
        break;
      case 'variety-desc':
        orderBy = 'a.variety DESC';
        break;
      case 'user-asc':
        orderBy = 'r.user ASC';
        break;
      case 'user-desc':
        orderBy = 'r.user DESC';
        break;
      case 'quantity-desc':
        orderBy = 'a.quantity DESC';
        break;
      case 'quantity-asc':
        orderBy = 'a.quantity ASC';
        break;
    }
  }

  const [aresults] = await db.execute(
    `
        SELECT a.*, r.user, r.region
        FROM xaccession a
        JOIN xregistration r ON a.xregistration = r.ID
        WHERE ${whereConditions.join(' AND ')}
        ORDER BY ${orderBy}
        `,
    params,
  );

  const a = (aresults as any[]).map((r) => {
    try {
      r.images = JSON.parse(r.images);
    } catch (err) {
      //blank accessions do nothing
    }
    return r;
  });

  return a;
});
