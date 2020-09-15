import { PubSub } from '../pubsub'
import logger from '../logger'

const ALREADY_EXISTS = 6

abstract class Handler {
  protected readonly log
  constructor(
    name: string,
    public readonly pubsub: PubSub,
  ) {
    this.log = logger({ name })
  }
  public abstract handle(phase: Phase, data: any): Promise<void>
  protected async createTopic(name: string): Promise<void> {
    await this.pubsub.createTopic(name)
      .catch((err: any) => {
    if (err.code !== ALREADY_EXISTS) throw err
  })
    this.log.debug('Created topic', name)
  }
  protected async createPushSubscription(topic: string, subscription: string, pushEndpoint: string): Promise<void> {
    const config = { pushConfig: { pushEndpoint } }
    await this.pubsub.client.topic(topic).createSubscription(subscription, config)
      .catch((err: any) => {
    if (err.code !== ALREADY_EXISTS) throw err
  })
    this.log.debug('Created push subscription', topic + '/' + subscription, 'to endpoint', pushEndpoint)
  }
  protected async modifyPushSubscription(topic, subscription, pushEndpoint): Promise<void> {
    await this.pubsub.client.topic(topic).subscription(subscription).modifyPushConfig({ pushEndpoint })
    this.log.debug('Modified push subscription', subscription, 'to endpoint', pushEndpoint)
  }
  protected async deleteSubscription(subscription: string): Promise<void> {
    await this.pubsub.client.subscription(subscription).delete()
    this.log.debug('Deleted subscription', subscription)
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
