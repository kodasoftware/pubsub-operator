export const ADDED = 'ADDED';
export const MODIFIED = 'MODIFIED';
export const DELETED = 'DELETED';

export const handleTopicCustomResource = (client, createTopic, logger?: any) =>
  async function handleTopicCustomResource(type, data, callback?: any) {
    const topicName = data.metadata.name;
    let topic = null;

    if (logger) {
      logger.log(type, 'topic', topicName);
    }

    if (type === ADDED || type === MODIFIED) {
      topic = await createTopic(client, topicName);
    }
    if (type === DELETED && logger) {
      logger.log(type, 'has been removed, but controller does not implemented a delete from pub/sub');
    }
    if (typeof callback === 'function') {
      callback(topic);
    }
  }
;

export const handleSubscriptionCustomResource = (
  client,
  createTopic,
  createSubscription,
  modifySubscription,
  deleteSubscription,
  logger?: any
) =>
  async function handleSubscriptionCustomResource(type, data, callback?: any) {
    const topicName = data.spec.topic;
    const subscriptionName = data.metadata.name;
    const pushEndpoint = data.spec.endpoint;
    let subscription = null;

    if (logger) {
      logger.log(type, 'subscription', subscriptionName);
    }

    if (type === ADDED) {
      await createTopic(client, topicName);
      subscription = await createSubscription(client, topicName, subscriptionName, pushEndpoint);
    }
    if (type === MODIFIED) {
      subscription = await modifySubscription(client, topicName, subscriptionName, pushEndpoint);
    }
    if (type === DELETED) {
      subscription = await deleteSubscription(client, subscriptionName);
    }
    if (typeof callback === 'function') {
      callback(subscription);
    }
  }
;

export const handleResourceEnd = (client, resourceApi, callback, logger?: any) =>
  async function handleResourceEnd(err?: any) {
    const resources = await resourceApi(client);
    if (err && logger) {
      logger.error(err);
    } else if (logger) {
      logger.log(resources);
    }
    callback(err || resources);
  }
;
