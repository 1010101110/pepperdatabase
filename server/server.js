// init
const Fastify = require('fastify');
const fastify = Fastify({ logger: true });
const fs = require('fs');
const path = require('path');
const { render } = require('../dist/server/entry-server.mjs');

// get local config
const config_s = require('./config');

// DB init
// fastify.register(require('@fastify/mysql'), {
//     connectionString: config_s.dbstring
// })

// get local certs
let httpsobj = null
if(config_s.certpath){
    httpsobj = {}
    httpsobj.key = fs.readFileSync(config_s.certpath + '/privkey.pem', 'utf8');
    httpsobj.cert = fs.readFileSync(config_s.certpath + '/fullchain.pem', 'utf8');
}

// routing not using the vue app
fastify.register(require('@fastify/static'), {
  root: path.resolve(__dirname, '../dist/client/assets'),
  prefix: '/assets'
});
fastify.register(require('@fastify/cors'));
fastify.register(require('@fastify/formbody'));

// routing for api
// fastify.register(require('./routes/users'), { prefix: '/api/users' });
// fastify.register(require('./routes/species'), { prefix: '/api/species' });
// fastify.register(require('./routes/varieties'), { prefix: '/api/varieties' });

// routing default to app
fastify.get('*', async (request, reply) => {
  const template = fs.readFileSync(path.resolve(__dirname, '../dist/client/client/index.html'), 'utf-8');
  const { html } = await render(request.raw.url);
  const page = template.replace('<!--app-html-->', html);
  reply.type('text/html').send(page);
});

// server runs
fastify.listen({ port: 3000 }, (err, address) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    console.log(`Server running at ${address}`);
});
