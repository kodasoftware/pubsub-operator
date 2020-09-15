import { KubeConfig, CustomObjectsApi } from '@kubernetes/client-node'
import logger from '../logger'
import { Handler } from '../handler'

const LOGGER = logger({ name: 'pubsub:watcher' })

class Watcher {
  private readonly client: CustomObjectsApi
  constructor(
    private readonly kubeConfig: KubeConfig,
    public readonly namespace: string = 'default',
  ) {
    this.client = this.kubeConfig.makeApiClient(CustomObjectsApi)
  }

  public async start(
    group: string, version: string, resource: string, handler: Handler): Promise<void> {
    await this.client.listNamespacedCustomObject(group, version, this.namespace, resource, "", null, null, null, 5, true)
      .then(async (res) => {
        const body = res.body as any
        if (!body) return
        await handler.handle(body.type, body.object).catch(this.handleError)
      }, this.handleError).then(() => this.start(group, version, resource, handler))
  }

  private handleError(err?: any) {
    if (err) {
      LOGGER.error(err)
    }
  }
}

export default Watcher