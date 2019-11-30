const {Users} = require('../models/associations')
const router = require('express').Router()
const SkinTypes = require('../models/skin-types')
const JourneyEntries = require('../models/journey-entries')
const multer = require('multer');
const url = require('url');

// need to add security for only admin can view

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 20
  },
  fileFilter: fileFilter
});

router.get('/users', async (req, res, next) => {
  try {
    const users = await Users.findAll()
    res.json(users)
  } catch (error) {
    next(error)
  }
})

router.get('/:email', async (req, res, next) => {
  try {
    const user = await Users.findAll({
      where: { email: req.params.email }
    })
  res.json(user);
  } catch (error) {
    next(error)
  }
});

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

router.post('/users/:id/entries', upload.single('entryImage'), async (req, res, next) => {
  try {
    const newEntryInfo = {
      userId: req.params.id,
      date: req.body.date,
      imageUrl: url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.file.path
      }),
      stressLevel: Number(req.body.stressLevel),
      diet: req.body.diet,
      description: req.body.description
    }
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

router.put('/users/:userId/entries/:entryId', upload.single('entryImage'), async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const entryId = req.params.entryId;
    const updatedEntryInfo = {
      date: req.body.date,
      imageUrl: url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.file.path
      }),
      stressLevel: Number(req.body.stressLevel),
      diet: req.body.diet,
      description: req.body.description
    }
    const [numRows, rows] = await JourneyEntries.update(updatedEntryInfo, {
      where: {
        id: entryId,
        userId: userId
      },
      returning: true,
      plain: true
    });
    res.json(rows);
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



router.put('/:id', async (req, res, next) => {
  try {
    const user = await Users.update(req.body, {where: { id: req.params.id }})
    res.json(user)
  } catch(error) {
    next(error)
  }
})


module.exports = router