import { Handler, Phase } from './'

export class SubscriptionHandler extends Handler {
  public async handle(phase: string, data: any): Promise<void> {
    if (!phase || !data) {
      return
    }
    const topic = data.spec.topic
    const subscription = data.metadata.name
    const pushEndpoint = data.spec.endpoint
    const pushConfig = { pushConfig: { pushEndpoint } }

    switch (phase) {
      case Phase.ADDED:
        await this.createTopic(topic)
        await this.pubsub.topic(topic).createSubscription(subscription, pushConfig)
        break
      case Phase.MODIFIED:
        await this.modifyPushSubscription(topic, subscription, pushEndpoint)
        break
      case Phase.DELETED:
        await this.deleteSubscription(subscription)
        break
    }
  }
}