const router = require('express').Router();
const {Post, User} = require('../../models')

// GET all user posts
router.get('/', (req, res) => {
  Post.findAll({
    attributes: ['id', 'title', 'filename', 'description', 'created_at'],
    include: [
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
  .then(dbPostData => res.json(dbPostData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err)
  })
})

// GET single post
router.get('/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'title', 'filename', 'description', 'created_at'],
    include: [
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
  .then(dbPostData => {
    if (!dbPostData) {
      res.status(404).json({message: 'No posts found with this ID'});
      return;
    }
    res.json(dbPostData)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json(err)
  })
})

// POST a new post
router.post('/', (req, res) => {
  Post.create({
    title: req.body.title,
    filename: req.body.filename,
    description: req.body.description,
    user_id: req.body.user_id
  })
  .then(dbPostData => res.json(dbPostData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err)
  })
})

module.exports = router;