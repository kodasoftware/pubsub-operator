import * as gcloud from '@google-cloud/pubsub';

export { createTopic, getTopics } from './topic';
export {
  getSubscription,
  getSubscriptions,
  createSubscription,
  modifySubscription,
  deleteSubscription,
} from './subscription';

export const pubsub = (config) => new gcloud.PubSub(config);
