import { PubSub } from '@google-cloud/pubsub'
import logger from '../logger'

const ALREADY_EXISTS = 6

abstract class Handler {
  private readonly log
  constructor(
    name: string,
    public readonly pubsub: PubSub,
  ) {
    this.log = logger({ name })
  }
  public abstract handle(phase: Phase, data: any): Promise<void>
  protected async createTopic(name: string): Promise<void> {
    await this.pubsub.createTopic(name)
      .catch(this.errorHandler)
    console.log('Created topic', name)
  }
  protected async createPushSubscription(topic: string, subscription: string, pushEndpoint: string): Promise<void> {
    const config = { pushConfig: { pushEndpoint } }
    await this.pubsub.topic(topic).createSubscription(subscription, config)
      .catch(this.errorHandler)
    console.log('Created push subscription', topic + '/' + subscription, 'to endpoint', pushEndpoint)
  }
  protected async modifyPushSubscription(topic, subscription, pushEndpoint): Promise<void> {
    await this.pubsub.topic(topic).subscription(subscription).modifyPushConfig({ pushEndpoint })
    console.log('Modified push subscription', subscription, 'to endpoint', pushEndpoint)
  }
  protected async deleteSubscription(subscription: string): Promise<void> {
    await this.pubsub.subscription(subscription).delete()
    console.log('Deleted subscription', subscription)
  }
  private errorHandler(err: any) {
    if (err.code !== ALREADY_EXISTS) throw err
  }
}

export enum Phase {
  ADDED = 'ADDED',
  MODIFIED = 'MODIFIED',
  DELETED = 'DELETED',
}

export { Handler }
export { TopicHandler } from './topic'
export { SubscriptionHandler } from './subscription'
