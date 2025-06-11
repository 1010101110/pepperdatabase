import { buildAuth } from './auth.js'; // if you want to protect any route

async function routes(fastify, options) {
  //auth handler
  const auth = buildAuth(fastify);

  // 📌 Get all active users
  fastify.get('/users', async (request, reply) => {
    const connection = await fastify.mysql.getConnection();
    const [rows] = await connection.query(
      `SELECT * FROM users2 WHERE deleted = FALSE`
    );
    connection.release();
    return rows;
  });

  // 📌 Get a single user by ID
  fastify.get('/users/:id', async (request, reply) => {
    const { id } = request.params;
    const connection = await fastify.mysql.getConnection();
    const [rows] = await connection.query(
      `SELECT * FROM users2 WHERE id = ? AND deleted = FALSE`,
      [id]
    );
    connection.release();

    return rows.length ? rows[0] : reply.status(404).send({ error: 'User not found' });
  });

  // 📌 Create a new user
  fastify.post('/users', async (request, reply) => {
    const {
      name,
      email,
      bio = '',
      active = 0,
      account_type = 1,
      avatar = null,
      creation_timestamp = new Date().toISOString(),
      action_timestamp = null,
      activation_hash = null
    } = request.body;

    const connection = await fastify.mysql.getConnection();
    try {
      const [result] = await connection.query(
        `INSERT INTO users2
         (name, email, creation_timestamp, activation_hash)
         VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?, ?)`,
        [name, email, creation_timestamp, activation_hash]
      );
      reply.status(201).send({ message: 'User created', id: result.insertId });
    } catch (err) {
      reply.status(400).send({ error: 'Error creating user', details: err.message });
    } finally {
      connection.release();
    }
  });

  // 📌 Update an existing user
  fastify.put('/users/:id', async (request, reply) => {
    const { id } = request.params;
    const {
      name,
      email,
      bio,
      active,
      account_type,
      avatar,
      action_timestamp,
      activation_hash
    } = request.body;

    const connection = await fastify.mysql.getConnection();
    try {
      const [result] = await connection.query(
        `UPDATE users2 SET
         name = ?, email = ?, bio = ?, active = ?, account_type = ?, avatar = ?, action_timestamp = ?, activation_hash = ?
         WHERE id = ? AND deleted = FALSE`,
        [name, email, bio, active, account_type, avatar, action_timestamp, activation_hash, id]
      );

      if (result.affectedRows) {
        reply.send({ message: 'User updated' });
      } else {
        reply.status(404).send({ error: 'User not found or already deleted' });
      }
    } catch (err) {
      reply.status(400).send({ error: 'Error updating user', details: err.message });
    } finally {
      connection.release();
    }
  });

  // 📌 Soft-delete a user
  fastify.delete('/users/:id', async (request, reply) => {
    const { id } = request.params;

    const connection = await fastify.mysql.getConnection();
    const [result] = await connection.query(
      `UPDATE users2 SET deleted = TRUE WHERE id = ? AND deleted = FALSE`,
      [id]
    );
    connection.release();

    return result.affectedRows
      ? { message: 'User deleted' }
      : reply.status(404).send({ error: 'User not found or already deleted' });
  });
}

export default routes;
