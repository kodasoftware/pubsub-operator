import { Watch } from '@kubernetes/client-node';

class Watcher {
  private readonly watcher: Watch
  constructor(kubeConfig?: any) {
    this.watcher = new Watch(kubeConfig)
  }

  public start(
    group: string, version: string, resource: string, handler: (phase: string, object: any) => void): Promise<void> {
    return new Promise((res) => this.watcher.watch(`/apis/${group}/${version}/${resource}`, {}, handler, (err) => {
      this.handleError(err)
      res()
    })).then(() => this.start(group, version, resource, handler))
  }

  private handleError(err?: any) {
    if (err) {
      console.error(err)
    }
    console.log('Completed a watch loop')
  }
}

export default Watcher