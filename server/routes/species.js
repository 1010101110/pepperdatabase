import { buildAuth } from './auth.js';

async function routes (fastify, options) {
  //auth handler
  const auth = buildAuth(fastify);

  // 📌 Get all species
  fastify.get('/species', async (request, reply) => {
    const connection = await fastify.mysql.getConnection();
    const [rows] = await connection.query('SELECT * FROM species');
    connection.release();
    return rows;
  });

  // 📌 Get a single species by ID
  fastify.get('/species/:id', async (request, reply) => {
    const { id } = request.params;
    const connection = await fastify.mysql.getConnection();
    const [rows] = await connection.query('SELECT * FROM species WHERE ID = ?', [id]);
    connection.release();
    return rows.length ? rows[0] : reply.status(404).send({ error: 'Species not found' });
  });

  // 📌 Create a new species
  fastify.post('/species', { preHandler: auth }, async (request, reply) => {
    const { name, attribute, description } = request.body;

    const connection = await fastify.mysql.getConnection();
    const [result] = await connection.query(
      `INSERT INTO species (name, attribute, description)
       VALUES (?, ?, ?)`,
      [name, attribute, description]
    );
    connection.release();

    return reply.status(201).send({ message: 'Species created', id: result.insertId });
  });

  // 📌 Update an existing species
  fastify.put('/species/:id', { preHandler: auth }, async (request, reply) => {
    const { id } = request.params;
    const { name, attribute, description } = request.body;

    const connection = await fastify.mysql.getConnection();
    const [result] = await connection.query(
      `UPDATE species
       SET name=?, attribute=?, description=?
       WHERE ID=?`,
      [name, attribute, description, id]
    );
    connection.release();

    return result.affectedRows ? { message: 'Species updated' } : reply.status(404).send({ error: 'Species not found' });
  });

  }

  export default routes;