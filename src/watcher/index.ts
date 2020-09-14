import { KubeConfig, CustomObjectsApi } from '@kubernetes/client-node'
import logger from '../logger'
import { Handler } from '../handler'

class Watcher {
  private readonly client: CustomObjectsApi
  private readonly log = logger({ name: 'pubsub:watcher' })
  constructor(
    private readonly kubeConfig: KubeConfig,
    public readonly namespace: string = 'default',
  ) {
    this.client = this.kubeConfig.makeApiClient(CustomObjectsApi)
  }

  public async start(
    group: string, version: string, resource: string, handler: Handler): Promise<void> {
    await this.client.listNamespacedCustomObject(group, version, this.namespace, resource, "", null, null, null, 5, true)
      .then((res) => {
        const body = res.body as any
        if (!body) return
        handler.handle(body.type, body.object)
      }, this.handleError).then(() => this.start(group, version, resource, handler))
  }

  private handleError(err?: any) {
    if (err) {
      this.log.error(err)
    }
  }
}

export default Watcher