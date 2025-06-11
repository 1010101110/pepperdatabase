async function routes (fastify, options) {

  // 📌 Get all xregistrations
  fastify.get('/xregistration', async (request, reply) => {
    const connection = await fastify.mysql.getConnection();
    const [rows] = await connection.query('SELECT * FROM xregistration');
    connection.release();
    return rows;
  });
  
  // 📌 Get a single xregistration by ID
  fastify.get('/xregistration/:id', async (request, reply) => {
    const { id } = request.params;
    const connection = await fastify.mysql.getConnection();
    const [rows] = await connection.query('SELECT * FROM xregistration WHERE ID = ?', [id]);
    connection.release();
    return rows.length ? rows[0] : reply.status(404).send({ error: 'xregistration not found' });
  });
  
  // 📌 Create a new xregistration
  fastify.post('/xregistration', async (request, reply) => {
    const { exchange, email, user, region, wishlist, address } = request.body;
    const id = uuidv4(); // Generate a unique ID
  
    const connection = await fastify.mysql.getConnection();
    const [result] = await connection.query(
      `INSERT INTO xregistration (ID, exchange, email, user, region, wishlist, address) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, exchange, email, user, region, wishlist, address]
    );
    connection.release();
  
    return reply.status(201).send({ message: 'xregistration created', id });
  });
  
  // 📌 Update an existing xregistration
  fastify.put('/xregistration/:id', async (request, reply) => {
    const { id } = request.params;
    const { exchange, email, user, region, wishlist, address, sent, received, returned } = request.body;
  
    const connection = await fastify.mysql.getConnection();
    const [result] = await connection.query(
      `UPDATE xregistration 
       SET exchange=?, email=?, user=?, region=?, wishlist=?, address=?, sent=?, received=?, returned=?, edit_on=NOW()
       WHERE ID=?`,
      [exchange, email, user, region, wishlist, address, sent, received, returned, id]
    );
    connection.release();
  
    return result.affectedRows ? { message: 'xregistration updated' } : reply.status(404).send({ error: 'xregistration not found' });
  });
    
}
  
  export default routes;