import { Watch, KubeConfig, CustomObjectsApi } from '@kubernetes/client-node'

class Watcher {
  private readonly client: CustomObjectsApi
  constructor(
    private readonly kubeConfig?: KubeConfig,
    public readonly namespace: string = 'default',
  ) {
    this.client = this.kubeConfig.makeApiClient(CustomObjectsApi)
  }

  public async start(
    group: string, version: string, resource: string, handler: (phase: string, object: any) => void): Promise<void> {
    await this.client.listNamespacedCustomObject(group, version, this.namespace, resource, "", null, null, null, 5, true)
      .then((res) => {
        const body = res.body as any
        if (!body) return
        handler(body.type, body.object)
      }, this.handleError).then(() => this.start(group, version, resource, handler))
  }

  private handleError(err?: any) {
    if (err) {
      console.error(err)
    }
  }
}

export default Watcher