import { Watch } from '@kubernetes/client-node';

class Watcher {
  private readonly watcher: Watch
  constructor(kubeConfig?: any, public readonly namespace: string = 'default') {
    this.watcher = new Watch(kubeConfig)
  }

  public start(
    group: string, version: string, resource: string, handler: (phase: string, object: any) => void): Promise<void> {
    const url = `/apis/${group}/${version}/namespaces/${this.namespace}/${resource}`
    return new Promise((res, rej) => this.watcher.watch(url, {}, handler, (err) => {
      try {
        this.handleError(err)
      } catch (err) {
        rej(err)
      }
      res()
    })).then(() => this.start(group, version, resource, handler))
  }

  private handleError(err?: any) {
    if (err) {
      if (err.statusCode === 401) { throw err }
    }
  }
}

export default Watcher