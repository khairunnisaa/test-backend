const Logs = require('./../services/Logs')
const db = require('../../migration');

module.exports = {

   /**
    * store logs details.
    */
   logsStore: (req, res, next) => {
      const logsData = {
         firstname: req.body.firstname,
         lastname: req.body.lastname,
         logsname: req.body.logsname,
         password: req.body.password,
         mobile: req.body.mobile,
      }
      const logs = new Logs(logsData);

      db.query(logs.addLogs(), (err, result) => {
         if (err) {
            res.status(400).json({
               'error': err.message,
               'error_line': err.files,
            })
         };

         db.query(Logs.getLogsById(result.insertId), (err, logsData) => {
            console.log(logsData[0]);
            res.status(200).json({
               'data': logsData[0],
            });
         })
      });
   },

   /**
    * Get the lists of all logss.
    */
   logssLists: (req, res, next) => {
      db.query(Logs.getAllLogss(), (err, result) => {
         if (err) {
            res.status(400).json({
               'error': err.message,
            })
         }

         res.status(200).json({
            'data': result,
         });
      })
   },

   /**
    * Update logs details.
    */
   updateLogs: (req, res, next) => {
      const logsData = {
         firstname: req.body.firstname,
         lastname: req.body.lastname,
         logsname: req.body.logsname,
         password: req.body.password,
         mobile: req.body.mobile,
      }

      const logs = new Logs(logsData);
      const id = req.params.id;
      db.query(logs.updateLogs(id), (err, result) => {
         if(err) {
            res.status(400).json({
               'error': err.message,
            });
         }

         db.query(Logs.getLogsById(id), (err, logsData) => {

            if (err) {
               res.status(400).json({
                  'error': err.message,
               });
            }

            res.status(200).json({
               'message': 'Logs updated successfully.',
               'data': logsData[0],
            });
         });
      });
   },
   /**
    * get logs details by logs id.
    */
   getLogsById: (req, res, next) => {
      const id = req.params.id;
      db.query(Logs.getLogsById(id), (err, result) => {
         if(err) {
            res.status(404).json({
               'error': err.message,
            });
         }

         res.status(200).json({
            'data': result[0],
         });
      })
   },

   deleteLogs: (req, res, next) => {
      const id = req.params.id;
      db.query(Logs.deleteLogsById(id), (err, result) => {
         if (err) {
            res.status(404).json({
               'error': err.message,
            });
         }

         res.status(200).json({
            'message': 'Logs deleted successfully.',
         });
      })
   }
}