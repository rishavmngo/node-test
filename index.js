const express = require('express')
const authRouter = require('./routes/auth.route.js')
const userRouter = require('./routes/user.route.js')
const db = require('./models/connection.js')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const config = require('./config/config.js')

const app = express()

app.use(cookieParser())
app.use(cors())
app.use(express.json())

//routes
app.use('/auth', authRouter)
app.use('/users', userRouter)

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

app.listen(config.serverPort, (req, res) => {
  console.log('server is running on port 3000')
})
