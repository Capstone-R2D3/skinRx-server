const {Users} = require('../models/associations')
const router = require('express').Router()
const SkinTypes = require('../models/skin-types')

// need to add security for only admin can view
router.get('/users', async (req, res, next) => {
  try {
    const users = await Users.findAll()
    res.json(users)
  } catch (error) {
    next(error)
  }
})

router.put('/users/:id', async (req, res, next) => {
  try {
    const result = req.body.result;
    const id = req.params.id;
    let user = await Users.findByPk(id);
    const skinType = await SkinTypes.findOne({
      where: {
        name: result
      }
    })
    user.skinTypeId = skinType.id;
    await user.save();
    res.json(user);
  } catch (error) {
    next(error)
  }
})

router.post('/signup', async (req, res, next) => {
  try {
    const email = await Users.findOne({ where: { email: req.body.email } })
    if (!email) {
      const user = await Users.create(req.body);
      res.json(user)
    } else {
      res.send('User already exists');
    }
  } catch (err) {
      next(err)
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const user = await Users.findOne({ where: { email: req.body.email } });
    if (!user) {
      console.log('No such user found:', req.body.email);
      res.send('Wrong username and/or password');
    } else if (!user.correctPassword(req.body.password)) {
      console.log('Incorrect password for user:', req.body.email);
      res.send('Wrong username and/or password');
    } else {
      res.json(user)
    }
  } catch (err) {
    next(err);
  }
});

router.get('/me', (req, res, next) => {
  res.json(req.user);
});


module.exports = router