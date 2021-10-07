class Logs {

   constructor(data) {
      this.datetime = data.datetime;
      this.method = data.method;
      this.url = data.url;
   }

   addLogs() {
   	  return `INSERT INTO logs (datetime,method, url) \
                   VALUES('${this.datetime.formatted_date}','${this.method.method}', '${this.url.url}')`;
   }
}

module.exports = Logs;