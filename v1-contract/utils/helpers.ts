const pressAnyKey = require('press-any-key')
const fs = require('fs')

const readJson = (path: string) => {
  const json = fs.readFileSync(path)
  return JSON.parse(json)
}

const waitForInput = async (message: string) => {
  console.log(message)
  await pressAnyKey('Press any key to continue, or CTRL+C to reject', {
    ctrlC: 'reject'
  })
}

export { readJson, waitForInput }
