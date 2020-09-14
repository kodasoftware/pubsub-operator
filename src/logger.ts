import * as log from 'pino'
import { config } from './config'

export default ({ name }) => log({ ...config.logger, name })
