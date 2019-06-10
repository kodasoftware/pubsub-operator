import 'should';
import { Topic } from '@google-cloud/pubsub'

import { pubsub } from '../../src/pubsub';
import { configuration } from '../../src/config';
import { createTopic, getTopics } from '../../src/pubsub';

describe('Topic', () => {
  const client = pubsub(configuration);

  describe('Create topic', () => {
    it('should create a new topic', async () => {
      const topicName = 'test-topic';
      const topics = await createTopic(client, topicName);
      topics.should.have.properties(['name']);
      (topics as Topic).name.should.be.equal(
        `projects/${configuration.projectId}/topics/${topicName}`,
      );
    });
    
    it('should return existing topic if attempting to recreate', async () => {
      const topicName = 'test-topic2';
      const topic = await createTopic(client, topicName);
      topic.should.have.properties(['name']);
      (topic as Topic).name.should.be.equal(
        `projects/${configuration.projectId}/topics/${topicName}`,
      );
      const topic2 = await createTopic(client, topicName);
      topic2.should.have.properties(['name']);
      (topic2 as Topic).name.should.be.equal(
        `projects/${configuration.projectId}/topics/${topicName}`,
      );
      topic.should.be.eql(topic2);
    });
  });

  describe('Get topics', () => {
    it('should return all topics', async () => {
      const topicName = 'test-topic3';
      const topic = await createTopic(client, topicName);
      const topics = await getTopics(client);
      topics.should.be.Array();
      (topics as Topic[]).forEach((topic) => topic.should.be.instanceOf(Topic));
      (topics as Topic[]).find((_topic) => _topic.name.includes(topicName)).should.be.eql(topic);
    });

    it('should return a single topic', async () => {
      const topicName = 'test-topic4';
      const createdTopic = await createTopic(client, topicName);
      const topic = await getTopics(client, topicName);
      (topic as Topic).should.be.eql(createdTopic);
    });
  });
});
