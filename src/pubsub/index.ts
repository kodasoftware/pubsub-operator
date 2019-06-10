import * as gcloud from '@google-cloud/pubsub';

export const pubsub = (config) => new gcloud.PubSub(config);
