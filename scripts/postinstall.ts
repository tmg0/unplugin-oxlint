import { addDevDependency } from 'nypm'
import { peerDependencies } from '../package.json'

addDevDependency(Object.keys(peerDependencies), { workspace: true })
