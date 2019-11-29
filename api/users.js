const {Users} = require('../models/associations')
const router = require('express').Router()
const SkinTypes = require('../models/skin-types')
const JourneyEntries = require('../models/journey-entries')

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

// req.body ----> {date, imageUrl, stressLevel, diet, description}
router.post('/users/:id/entries', async (req, res, next) => {
  try {
    const newEntryInfo = req.body;
    newEntryInfo.userId = req.params.id;
    const newEntry = await JourneyEntries.create(newEntryInfo);
    res.send(newEntry);
  } catch (error) { 
    next(error)
  }
})

router.get('/users/:id/entries', async (req, res, next) => {
    try {
        const id = req.params.id;
        const allEntries = await JourneyEntries.findAll({
            where: {
                userId: id
            },
            order: [['date', 'DESC']]
        });
        res.json(allEntries);
    } catch (error) {
        next(error);
    }
})

router.put('/users/:userId/entries/:entryId', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const entryId = req.params.entryId;
    const updatedEntry = await JourneyEntries.update(req.body, {
      where: {
        id: entryId,
        userId: userId
      }
    });
    res.json(updatedEntry);
  } catch (error) {
    next(error);
  }
})

router.delete('/users/:userId/entries/:entryId', async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const entryId = req.params.entryId;
    await JourneyEntries.destroy({
      where: {
        id: entryId,
        userId: userId
      }
    });
    res.status(200).send('Entry deleted!');
  } catch (error) {
    next(error);
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


router.get('/me', async (req, res, next) => {
  try {
    const user = await Users.findAll({
      where: { email: req.body.email }
    })
  res.json(user);
  } catch (error) {
    next(error)
  }
  
});


router.put('/:id', async (req, res, next) => {
  try {
    // console.log('hi from server side')
    // console.log('parameters', req.params)
    // console.log(req.body.firstName, req.body.lastName, req.body.email)
    // const user = await Users.update({
    //   firstName: req.body.firstName, 
    //   lastName: req.body.lastName, 
    //   email: req.body.email, 
    //   password: req.body.password,
    // }, {where: { id: req.params.id }})

    const user = await Users.update(req.body, {where: { id: req.params.id }})
    res.json(user)
  } catch(error) {
    next(error)
  }
})


module.exports = router