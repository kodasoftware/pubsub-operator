import * as should from 'should';
import * as td from 'testdouble';

import {
  ADDED,
  MODIFIED,
  DELETED,
  handleTopicCustomResource,
  handleSubscriptionCustomResource,
  handleResourceEnd,
} from '../../src/controller';

describe('Controller', () => {
  const client = td.object();
  const createTopic = td.function();
  const getTopics = td.function();
  const createSubscription = td.function();
  const modifySubscription = td.function();
  const deleteSubscription = td.function();
  const getSubscriptions = td.function();
  const anyMatcher = td.matchers.anything();
  const argIgnore = { ignoreExtraArgs: true };
  const mockData = { metadata: { name: 'mock' }, spec: { topic: 'mock', endpoint: '/mock' } };
  const mockResult = { mock: 'foo' };

  afterEach(() => td.reset());

  describe('Topic custom resource handler', () => {
    it('should handle topic ADDED event', async () => {
      const func = handleTopicCustomResource(client, createTopic);
      td.when(createTopic(anyMatcher), argIgnore).thenResolve(mockResult);
      await func(ADDED, mockData, (result) => result.should.be.eql(mockResult));
    });
    it('should handle topic MODIFIED event', async () => {
      const func = handleTopicCustomResource(client, createTopic);
      td.when(createTopic(anyMatcher), argIgnore).thenResolve(mockResult);
      await func(MODIFIED, mockData, (result) => result.should.be.eql(mockResult));
    });
    it('should ignore topic DELETED event', async () => {
      const func = handleTopicCustomResource(client, createTopic);
      await func(DELETED, mockData, (result) => should.not.exist(result));
    });
  });

  describe('Subscription custom resource handler', () => {
    it('should handle subscription ADDED event', async () => {
      const func = handleSubscriptionCustomResource(
        client, createTopic, createSubscription, modifySubscription, deleteSubscription,
      );
      td.when(createTopic(anyMatcher), argIgnore).thenResolve(true);
      td.when(createSubscription(anyMatcher), argIgnore).thenResolve(mockResult);
      func(ADDED, mockData, (result) => {
        result.should.be.eql(mockResult);
      });
    });
    it('should handle subscription MODIFIED event', async () => {
      const func = handleSubscriptionCustomResource(
        client, createTopic, createSubscription, modifySubscription, deleteSubscription,
      );
      td.when(modifySubscription(anyMatcher), argIgnore).thenResolve(mockResult);
      func(MODIFIED, mockData, (result) => {
        result.should.be.eql(mockResult);
      });
    });
    it('should handle subscription DELETED event', async () => {
      const func = handleSubscriptionCustomResource(
        client, createTopic, createSubscription, modifySubscription, deleteSubscription,
      );
      td.when(deleteSubscription(anyMatcher), argIgnore).thenResolve(mockResult);
      func(DELETED, mockData, (result) => {
        result.should.be.eql(mockResult);
      });
    });
  });

  describe('Resource end handler', () => {
    it('should handle callback with no error', async () => {
      const func = handleResourceEnd(client, getSubscriptions, (result) => {
        result.should.be.eql(mockResult);
      });
      td.when(getSubscriptions(anyMatcher), argIgnore).thenResolve(mockResult);
      await func();
    });
    it('should handle callback with error', async () => {
      const error = new Error('err');
      const func = handleResourceEnd(client, getSubscriptions, (result) => {
        result.should.be.eql(error);
      });
      await func(error);
    });
  });
});
