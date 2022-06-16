const router = require('express').Router();
const {Post, User, Vote} = require('../../models')
const sequelize = require('../../config/connection')

// GET all user posts
router.get('/', (req, res) => {
  Post.findAll({
    attributes: ['id', 'title', 'description', 'created_at',
    [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),'vote_count']
    ],
    order:[['created_at', 'DESC']],
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
    attributes: ['id', 'title', 'description', 'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
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

// UPVOTE route
router.put('/upvote', (req, res) => {
  Vote.create({
    user_id: req.body.user_id,
    post_id: req.body.post_id
  })
  .then(() => {
    return Post.findOne({
      where: {
        id: req.body.post_id
      },
      attributes: ['id', 'title', 'description', 'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
    'vote_count']]
    })
  })
  .then(dbPostData => res.json(dbPostData))
  .catch(err => res.json(err))
})

//!!!!!! We'll see about doing this.
// //DOWNVOTE
// router.put('/downvote', (req, res) => {
//   Vote.create({
//     user_id: req.body.user_id,
//     post_id: req.body.post_id
//   })
//   .then(dbPostData => res.json(dbPostData))
//   .catch(err => res.json(err))
// })

// UPDATE post title
router.put('/:id', (req, res) => {
  Post.update(
    {
      title: req.body.title
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
  .then(dbPostData => {
    if (!dbPostData) {
      res.status(404).json({message: 'No post found with this ID'});
      return;
    }
    res.json(dbPostData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
})

router.delete('/:id', (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbPostData => {
    if(!dbPostData) {
      res.status(404).json({message: 'No post found with this ID'})
      return;
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
})

module.exports = router;