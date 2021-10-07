const express = require('express')
const errorHandler = require('./errors/handler')
const fs = require("fs");
var Logs = require('./services/Logs')
var db = require('./config/migration')

class Server {
  constructor (config) {
    this.config = config
    this.app = express()
    this.endpoints = []
    this.routers = []
  }

  registerRoutes () {
    let demoLogger = (req, res, next) => { //middleware function
      let current_datetime = new Date();
      let formatted_date =
        current_datetime.getFullYear() +
        "-" +
        (current_datetime.getMonth() + 1) +
        "-" +
        current_datetime.getDate() +
        " " +
        current_datetime.getHours() +
        ":" +
        current_datetime.getMinutes() +
        ":" +
        current_datetime.getSeconds();
      let method = req.method;
      let url = req.url;
      let status = res.statusCode;
      const start = process.hrtime();
      const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
      let log = `[${formatted_date}] ${method}:${url} ${status} ${durationInMilliseconds.toLocaleString()} ms`;
      const logsData = {
         datetime: {formatted_date},
         method: {method},
         url: {url},
         raw: req.body,
      }
      const logs = new Logs(logsData);
      
      db.query(logs.addLogs(), (err, result) => {
         if (err) {
            res.status(400).json({
               'error': err.message,
               'error_line': err.files,
            })
         };
      });
      
      logs.addLogs(({formatted_date},{method},{url}));
      fs.appendFile("request_logs.txt", log + "\n", err => {
        if (err) {
          console.log(err);
        }
      });
      next();
    };

    const getActualRequestDurationInMilliseconds = start => {
      const NS_PER_SEC = 1e9; //  convert to nanoseconds
      const NS_TO_MS = 1e6; // convert to milliseconds
      const diff = process.hrtime(start);
      return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
    };



    this.app.use(demoLogger);
    this.app.get('/', (req, res) => res.json({message: `welcome to ${this.config.name}`}))
    
    this.routers.forEach(router => {
      let routes = router(express.Router())
      this.app.use(this.registerRoute(routes))
    })

    this.app.get('/endpoints', (req, res) => res.json(this.endpoints))
  }

  registerRoute (routes) {
    routes.stack.forEach((stack, i) => {
      if (stack.route) {
        this.endpoints.push({
          method: stack.route.stack[0].method.toUpperCase(),
          path: stack.route.path
        })
      }
    })

    return routes
  }

  router (router) {
    if (typeof router === 'function') {
      this.routers.push(router)
    }
  }

  setUpServer () {
    this.registerRoutes()
    this.app.use(errorHandler())
    this.app.listen(this.config.port, this.listeningReporter)
  }

  listeningReporter () {
    const { address, port } = this.address()
    const protocol = this.addContext ? 'https' : 'http'
    console.log(`Listening on ${protocol}://${address}:${port}...`)
  }

  run () {
    try {
      this.setUpServer()
    } catch (e) {
      console.log(e.message || 'Error create server')
    }
  }
}

module.exports = Server