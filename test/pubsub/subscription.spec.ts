import 'should';
import { Subscription } from '@google-cloud/pubsub';

import { pubsub } from '../../src/pubsub';
import { configuration } from '../../src/config';
import {
  createTopic,
  getSubscription,
  getSubscriptions,
  createSubscription,
  modifySubscription,
  deleteSubscription,
} from '../../src/pubsub';

const UNSUPPORTED = 3;
const NOT_FOUND = 5;

describe('Subscription', () => {
  const client = pubsub(configuration);

  describe('Create subscription', () => {
    it('should throw an error if no topic exists', async () => {
      const topicName = 'subscribe-topic1';
      const subscriptionName = 'subscribe-topic1-subscription';
      const pushEndpoint = 'http://example.com/endpoint';

      try {
        await createSubscription(client, topicName, subscriptionName, pushEndpoint);
      } catch (err) {
        err.code.should.be.equal(NOT_FOUND);
      }
    });

    it('should throw an error if push endpoint not supported', async () => {
      const topicName = 'subscribe-topic1';
      const subscriptionName = 'subscribe-topic1-subscription';
      const pushEndpoint = '/endpoint';

      try {
        await createSubscription(client, topicName, subscriptionName, pushEndpoint);
      } catch (err) {
        err.code.should.be.equal(UNSUPPORTED);
      }
    });

    it('should create a subscription', async () => {
      const topicName = 'subscribe-topic1';
      const subscriptionName = 'subscribe-topic1-subscription';
      const pushEndpoint = 'http://example.com/endpoint';

      await createTopic(client, topicName);
      const subscription = (await createSubscription(client, topicName, subscriptionName, pushEndpoint))[0];

      (subscription as Subscription).name.should.be.eql(
        `projects/${configuration.projectId}/subscriptions/${subscriptionName}`,
      );
      (subscription as Subscription).topic.should.be.eql(
        `projects/${configuration.projectId}/topics/${topicName}`,
      );
    });
  });

  describe('Get subscription', () => {
    it('should return a subscription', async () => {
      const topicName = 'subscribe-topic2';
      const subscriptionName = 'subscribe-topic2-subscription';
      const pushEndpoint = 'http://example.com/endpoint';

      await createTopic(client, topicName);
      const createdSubscription = await createSubscription(client, topicName, subscriptionName, pushEndpoint);
      const subscription = (await getSubscription(client, subscriptionName))[0];

      subscription.should.be.eql(createdSubscription[0]);
    });
  });

  describe('Get subscriptions', () => {
    it('should return all subscriptions', async () => {
      const topicName = 'subscribe-topic3';
      const subscriptionName = 'subscribe-topic3-subscription';
      const pushEndpoint = 'http://example.com/endpoint';

      await createTopic(client, topicName);
      await createSubscription(client, topicName, subscriptionName, pushEndpoint);

      const subscriptions = (await getSubscriptions(client))[0];

      subscriptions.should.be.Array();
      subscriptions.forEach((subscription) => subscription.should.be.instanceOf(Subscription));
      subscriptions.find((subscription) => subscription.metadata.name.includes(subscriptionName))
        .should.be.instanceOf(Subscription);
    });
  });

  describe('Modify subscription', () => {
    it('should throw an error if subscription does not exist', async () => {
      const topicName = 'subscribe-topic4';
      const subscriptionName = 'subscribe-topic4-subscription';
      const pushEndpoint = 'http://example.com/endpoint';

      try {
        await modifySubscription(client, topicName, subscriptionName, pushEndpoint);
      } catch (err) {
        err.code.should.be.eql(NOT_FOUND);
      }
    });

    it('should modify an existing subscription', async () => {
      const topicName = 'subscribe-topic5';
      const subscriptionName = 'subscribe-topic5-subscription';
      const pushEndpoint = 'http://example.com/endpoint';
      const newPushEndpoint = 'http://example.com/newendpoint';

      await createTopic(client, topicName);
      await createSubscription(client, topicName, subscriptionName, pushEndpoint);
      await modifySubscription(client, topicName, subscriptionName, newPushEndpoint);
    });
  });

  describe('Delete subscription', () => {
    it('should throw an error if subscription does not exist', async () => {
      const subscriptionName = 'subscribe-topic6-subscription';
      try {
        await deleteSubscription(client, subscriptionName);
      } catch (err) {
        err.code.should.be.eql(NOT_FOUND);
      }
    });

    it('should delete a subscription', async () => {
      const topicName = 'subscribe-topic6';
      const subscriptionName = 'subscribe-topic6-subscription';
      const pushEndpoint = 'http://example.com/endpoint';

      await createTopic(client, topicName);
      await createSubscription(client, topicName, subscriptionName, pushEndpoint);
      await deleteSubscription(client, subscriptionName);
    });
  })
});
