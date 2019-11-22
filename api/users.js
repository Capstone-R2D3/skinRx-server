const Users = require('../models/users')
const router = require('express').Router()

router.post('/login', async (req, res, next) => {
  try {
    const user = await Users.findOne({ where: { email: req.body.email } });
    if (!user) {
      console.log('No such user found:', req.body.email);
      res.status(401).send('Wrong username and/or password');
    } else if (!user.correctPassword(req.body.password)) {
      console.log('Incorrect password for user:', req.body.email);
      res.status(401).send('Wrong username and/or password');
    } else {
      res.json(user)
    }
  } catch (err) {
    next(err);
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    const user = await Users.create(req.body);
    res.json(user)
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists');
    } else {
      next(err);
    }
  }
});

router.get('/me', (req, res) => {
  res.json(req.user);
});


module.exports = router