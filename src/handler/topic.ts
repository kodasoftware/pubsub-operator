import { Handler, Phase } from './'

export class TopicHandler extends Handler {
  public async handle(phase: string, data: any): Promise<void> {
    switch(phase) {
      case Phase.ADDED:
      case Phase.DELETED:
        const name = data.metadata.name
        await this.createTopic(name)
        break
      default:
        console.log('[TopicHandler] Ignorning phase', phase, 'and data', data)
        return
    }
  }
}
