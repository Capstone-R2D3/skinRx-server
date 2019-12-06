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

router.post('/users/:id/entries', upload.array('entryImages'), async (req, res, next) => {
  try {
    let imageUrlsArray = [];
    for(let i=0; i < req.files.length; i++){
      const imageUrl = url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.files[i].path
      });
      imageUrlsArray.push(imageUrl);
    }
    const newEntryInfo = {
      userId: req.params.id,
      date: req.body.date,
      imageUrls: imageUrlsArray,
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

router.get('/users/:userId/entries/:date', async (req, res, next) => {
  try {
    // const dateStr = req.params.date.split("-")
    // let newDate = `${dateStr[1]}/${dateStr[1]}/${dateStr[0]}`
    const oneEntry = await JourneyEntries.findAll({ where: { userId: req.params.userId, date : req.params.date }})
    res.json(oneEntry)
  } catch (error) {
    next (error)
  }
})

router.put('/users/:userId/entries/:entryId', upload.array('entryImages'), async (req, res, next) => {
  try {
    let imageUrlsArray = [];
    for(let i=0; i < req.files.length; i++){
      const imageUrl = url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.files[i].path
      });
      imageUrlsArray.push(imageUrl);
    }
    const userId = req.params.userId;
    const entryId = req.params.entryId;
    const updatedEntryInfo = {
      date: req.body.date,
      imageUrls: imageUrlsArray,
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
    const user = await Users.findByPk(req.params.id) 
    const data = await user.update(req.body)
    res.json(data)
  } catch(error) {
    next(error)
  }
})


module.exports = router