const utils = require('./utils');

/*
  Mimicks the lambda context object
  http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
*/
module.exports = function createLambdaContext(fun, provider, cb) {

  const functionName = fun.name;
  const timeout = (fun.timeout || provider.timeout || 6) * 1000; // default 6 second timeout
  const endTime = new Date().getTime() + timeout;

  return {
    /* Methods */
    done: cb,
    succeed: res => cb(null, res, true),
    fail: err => cb(err, null, true),
    getRemainingTimeInMillis: () => endTime - new Date().getTime(),

    /* Properties */
    functionName,
    memoryLimitInMB:    fun.memorySize || provider.memorySize,
    functionVersion:    `offline_functionVersion_for_${functionName}`,
    invokedFunctionArn: `offline_invokedFunctionArn_for_${functionName}`,
    awsRequestId:       `offline_awsRequestId_${utils.randomId()}`,
    logGroupName:       `offline_logGroupName_for_${functionName}`,
    logStreamName:      `offline_logStreamName_for_${functionName}`,
    identity:           {},
    clientContext:      {},
  };
};
