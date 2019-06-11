import {
  createTopic,
  getTopics,
  getSubscriptions,
  createSubscription,
  modifySubscription,
  deleteSubscription
} from '../pubsub';

const ADDED = 'ADDED';
const MODIFIED = 'MODIFIED';
const DELETED = 'DELETED';

export const handleTopicCustomResource = (client) => 
  async function handleTopicCustomResource(type, data) {
    const topicName = data.metadata.name;

    console.log(type, 'topic', topicName);

    if (type === ADDED || type === MODIFIED) {
      await createTopic(client, topicName);
    }
    if (type === DELETED) {
      console.log(type, 'has been removed, but controller does not implemented a delete from pub/sub');
    }
  }
;

export const handleTopicEnd = (client, callback) => 
  async function handleTopicEnd(err?: any) {
    if (err) console.log(err);
    console.log(await getTopics(client));
    return callback();
  }
;

export const handleSubscriptionCustomResource = (client) =>
  async function handleSubscriptionCustomResource(type, data) {
    const topicName = data.spec.topic;
    const subscriptionName = data.metadata.name;
    const pushEndpoint = data.spec.endpoint;

    console.log(type, 'subscription', subscriptionName);

    if (type === ADDED) {
      await createTopic(client, topicName);
      await createSubscription(client, topicName, subscriptionName, pushEndpoint);
    }
    if (type === MODIFIED) {
      await modifySubscription(client, topicName, subscriptionName, pushEndpoint);
    }
    if (type === DELETED) {
      await deleteSubscription(client, subscriptionName);
    }
  }
;

export const handleSubscriptionEnd = (client, callback) =>
  async function handleSubscriptionEnd(err?: any) {
    if (err) console.log(err);
    console.log(await getSubscriptions(client));
    return callback();
  }
;
