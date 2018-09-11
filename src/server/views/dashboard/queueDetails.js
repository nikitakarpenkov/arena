const _ = require('lodash');
const QueueHelpers = require('../helpers/queueHelpers');

async function handler(req, res, next) {
  try {
    const {queueName, queueHost} = req.params;
    const {Queues} = req.app.locals;
    const queue = await Queues.get(queueName, queueHost);
    if (!queue) return res.status(404).render('dashboard/templates/queueNotFound', {queueName, queueHost});

    let jobCounts;
    if (queue.IS_BEE) {
      jobCounts = await queue.checkHealth();
      delete jobCounts.newestJob;
    } else {
      console.log('jobCounts');
      jobCounts = await queue.getJobCounts();
    }
    console.log('getStats');
    const stats = await QueueHelpers.getStats(queue);

    return res.render('dashboard/templates/queueDetails', {
      queueName,
      queueHost,
      jobCounts,
      stats
    });
  } catch (e) {
    next(e);
  }
}

module.exports = handler;