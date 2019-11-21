const Users = require('../models/users')
const router = require('express').Router()

router.get('/', async (req, res, next) => {
  try {
    const users = await Users.findAll()
    res.json(users)
  } catch (error) {
    next(error)
  }
})

// router.post('/login', async (req, res, next) => {
//   try {
//     const user = await Users.findOne({where: {email: req.body.email}})
//     if (!user) {
//       console.log('No such user found:', req.body.email)
//       res.status(401).send('Wrong username and/or password')
//     } else if (!user.correctPassword(req.body.password)) {
//       console.log('Incorrect password for user:', req.body.email)
//       res.status(401).send('Wrong username and/or password')
//     } else {
//       req.login(user, err => (err ? next(err) : res.json(user)))
//     }
//   } catch (err) {
//     next(err)
//   }
// })

router.get('/login', async (req, res, next) => {
  try {
    const user = await Users.findOne({where: {email: req.body.email}})
    if (!user) {
      console.log('User does not exist')
      res.status(401).send('Wrong username and/or password')
    } else if (!user.correctPassword(req.body.password)) {
      console.log('Incorrect password')
    } else {
      res.send(user)
    }
  } catch (error) {
    next(error)
  }
})

router.post('/signup', async (req, res, next) => {
  try {
    const user = await Users.create(req.body)
    req.login(user, err => (err ? next(err) : res.json(user)))
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists')
    } else {
      next(err)
    }
  }
})

router.post('/logout', (req, res) => {
  req.logout()
  req.session.destroy()
  res.redirect('/')
})

router.get('/me', (req, res) => {
  res.json(req.user)
})

module.exports = router