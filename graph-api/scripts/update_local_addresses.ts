console.log('Updating local addresses...')
const fs = require('fs')
const path = require('path')

const networksStr = fs
  .readFileSync(path.join(__dirname, '../networks.json'), 'utf8')
  .trim()
const networks = JSON.parse(networksStr)

const orgStr = fs.readFileSync(
  path.join(__dirname, '../../app/src/contracts/Org.json')
)
const org = JSON.parse(orgStr)

const tokenStr = fs.readFileSync(
  path.join(__dirname, '../../app/src/contracts/Token.json')
)
const token = JSON.parse(tokenStr)

const taskStorageStr = fs.readFileSync(
  path.join(__dirname, '../../app/src/contracts/TaskStorage.json')
)
const taskStorage = JSON.parse(taskStorageStr)

const taskStr = fs.readFileSync(
  path.join(__dirname, '../../app/src/contracts/Task.json')
)
const task = JSON.parse(taskStr)

const treasuryStr = fs.readFileSync(
  path.join(__dirname, '../../app/src/contracts/Treasury.json')
)
const treasury = JSON.parse(treasuryStr)

const actionStr = fs.readFileSync(
  path.join(__dirname, '../../app/src/contracts/Action.json')
)
const action = JSON.parse(actionStr)

const teamStr = fs.readFileSync(
  path.join(__dirname, '../../app/src/contracts/Team.json')
)
const team = JSON.parse(teamStr)

networks.mainnet.Organization.address = org.address
networks.mainnet.Treasury.address = treasury.address
networks.mainnet.ActionContract.address = action.address
networks.mainnet.TaskStorageContract.address = taskStorage.address
networks.mainnet.TeamContract.address = team.address
networks.mainnet.TokenContract.address = token.address
networks.mainnet.TaskContract.address = task.address

fs.writeFileSync(
  path.join(__dirname, '../networks.json'),
  JSON.stringify(networks, null, 2)
)

console.log('Updated local addresses successfully!')

export {}
