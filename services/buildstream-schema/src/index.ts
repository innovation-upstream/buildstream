import express from 'express'
import { v4 } from 'uuid'

const app = express()
const port = 80

app.use(express.static('public'))

app.listen(port, () => {
  console.log(`Timezones by location application is running on port ${port}.`)
})
