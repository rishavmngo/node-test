const express = require('express')
const authRouter = require('./routes/auth.route.js')
const db = require('./models/connection.js')

const app = express()

app.use(express.json())
app.use('/auth', authRouter)

app.get('/resetIdSequence', async (req, res) => {
  const q = `alter sequence users_uid_seq restart with 1;`

  try {
    await db.query(q)
    res.send('Users table uid column sequence is reseated to 1')
  } catch (err) {
    res.send(err)
  }
})
app.get('/', async (req, res) => {
  const result = await db.query('select * from users')
  res.send(result.rows)
})

app.listen(3000, (req, res) => {
  console.log('server is running on port 3000')
})
