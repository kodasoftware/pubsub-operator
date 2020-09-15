import * as gcloud from '@google-cloud/pubsub'
import { ClientConfig } from '@google-cloud/pubsub/build/src/pubsub'
import logger from '../logger'

const LOGGER = logger({ name: 'pubsub:client' })

export enum Errors {
  ALREADY_EXISTS = 6,
}

class PubSub {
  public readonly client: gcloud.PubSub
  constructor(
    config: ClientConfig,
  ) {
    this.client = new gcloud.PubSub(config)
  }

  public async createTopic(name) {
    await this.client.topic(name).create().catch(this.errorHandler)
  }

  private errorHandler(err) {
    if (err) {
      if (err.code === Errors.ALREADY_EXISTS) return
      LOGGER.error(err, 'Failed to create Topic')
    }
  }
}

export { PubSub }
