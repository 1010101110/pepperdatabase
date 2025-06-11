export function buildAuth(fastify) {
  return async function auth(request, reply) {
    const token = request.headers['authorization'];

    if (!token || !token.startsWith('Bearer ')) {
      return reply.status(401).send({ error: 'Unauthorized' });
    }

    const rawToken = token.replace('Bearer ', '');

    // Fetch user from DB using the token as user_id
    const connection = await fastify.mysql.getConnection();
    const [rows] = await connection.query(
      `SELECT * FROM users2 WHERE id = ? AND active = TRUE AND deleted = FALSE`,
      [rawToken]
    );
    connection.release();

    if (rows.length === 1) {
      request.user = rows[0]; // Attach user to request
    } else {
      return reply.status(401).send({ error: 'Invalid user' });
    }
  };
}