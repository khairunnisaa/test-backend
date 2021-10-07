require('dotenv').config()
const Server = require('./server');

let server = new Server({
  name: 'Movies With Express API (v1.0.0)',
  env: 'development',
  port: process.env.APP_PORT,
});

server.router(require('./routes/movies'));
server.run();