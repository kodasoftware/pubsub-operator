import { configureConfig } from '../config';
import { Watch } from '@kubernetes/client-node';

class Watcher extends Watch {
  constructor(kubeConfig?: any) {
    super(configureConfig(kubeConfig))
  }

  public start(
    group: string, version: string, resource: string, handler: (phase: string, object: any) => void): Promise<void> {
    return new Promise(async (res) => {
      await this.watch(`/apis/${group}/${version}/${resource}`, {}, handler, this.handleError)
      res(await this.start(group, version, resource, handler))
    })
  }

  private handleError(err?: any) {
    if (err) {
      console.error(err)
    }
    console.log('Completed a watch loop')
  }
}

export default Watcher