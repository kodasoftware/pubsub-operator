import { Handler, Phase } from './'

export class TopicHandler extends Handler {
  public async handle(phase: string, data: any): Promise<void> {
    switch(phase) {
      case Phase.ADDED:
      case Phase.DELETED:
        console.log('Found phase', phase, 'for data', data)
        const name = data.metadata.name
        console.log(this)
        await this.createTopic(name)
        break
    }
  }
}
