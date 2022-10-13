/* eslint-disable node/no-missing-import */
import { waitForInput } from '../utils/helpers'
import ActionDeploy from './action'
import OrgDeploy from './org'
import TaskDeploy from './task'
import TaskControlLogicLibraryDeploy from './taskControlLogicLibrary'
import TaskLibraryDeploy from './taskLibrary'
import TaskStorageDeploy from './task_storage'
import TeamDeploy from './team'
import TokenDeploy from './token'
import TreasuryDeploy from './treasury'

const deploySteps = [
  { func: TaskLibraryDeploy, message: 'Will deploy Task library' },
  {
    func: TaskControlLogicLibraryDeploy,
    message: 'Will deploy Task control logic library'
  },
  { func: TeamDeploy, message: 'Will deploy Team' },
  { func: OrgDeploy, message: 'Will deploy Org' },
  { func: TokenDeploy, message: 'Will deploy Token' },
  { func: TaskStorageDeploy, message: 'Will deploy TaskStorage' },
  { func: ActionDeploy, message: 'Will deploy Action' },
  { func: TaskDeploy, message: 'Will deploy Task' },
  { func: TreasuryDeploy, message: 'Will deploy Treasury' }
]

async function main() {
  for (let i = 0; i < deploySteps.length; i++) {
    const step = deploySteps[i]
    try {
      await waitForInput(step.message)
    } catch {
      continue
    }
    await step.func()
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
