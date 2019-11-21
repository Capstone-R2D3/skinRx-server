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

router.get('/login', async (req, res, next) => {
  try {
    const user = await Users.findAll({
      where: {
        email: req.body.data.email
      }
    })
    if (!user) {
      console.log('No such user found:', req.body.data.email)
      res.status(401).send('Wrong username and/or password')
    } else if (user.password !== req.body.data.password) {
      console.log('Incorrect password for user:', req.body.data.password)
      res.status(401).send('Wrong username and/or password')
    } else {
      // req.login(user, err => (err ? next(err) : res.json(user)))
      res.status(200).json(user)
    }
  } catch (err) {
    next(err)
  }
})

// router.get('/user', async (req, res, next) => {
//   try {
//     const user = await Users.findAll({where: {email: req.body.email}})
//     console.log('user')
//     if (!user) {
//       console.log('User does not exist')
//       res.status(401).send('Wrong username and/or password')
//     } else if (!user.correctPassword(req.body.password)) {
//       console.log('Incorrect password')
//     } else {
//       res.json(user)
//     }
//   } catch (error) {
//     next(error)
//   }
// })

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