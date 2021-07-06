const express = require('express');
const userDb = require('./userDb');
const postDb = require('../posts/postDb');
const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic!
  userDb
    .insert(req.body)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({error: "Error"});
    });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  const newPost = { ...req.body, user_id: req.params.id };
  postDb
    .insert(newPost)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => {
      res.status(500).json({ error: "Error adding a post for that user"})
    });
});

router.get('/', (req, res) => {
  // do your magic!
  userDb
    .get()
    .then (users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ error: "Error" });
    });
});

router.get('/:id', (req, res) => {
  // do your magic!
  userDb
    .getById(req.params.id)
    .then(user => {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User does not exist"})
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Error" })
    })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  userDb
    .getById(req.params.id)
    .then(user => {
      if (user) {
        userDb
          .getUserPosts(user.id)
          .then(posts => {
            res.status(200).json(posts)
          })
      } else {
        res.status(404).json({ message: "User not exists"})
      }
    })
    .catch(err => {
      res.status(500).json({error: "Error finding users posts by id"});
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  const id = req.params.id;
  userDb
    .remove(id)
    .then(user => {
      res.status(200).json({ message: `user ${id} deleted`})
    })
    .catch(err => {
      res.status(500).json({ error: "Error deleting user" });
    });
});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
  userDb
    .update(req.params.id, req.body)
    .then(user => {
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({ message: 'User not found' })
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'Error updateing user' })
    })
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const { id } = req.params;
  userDb
    .getById(id)
    .then(user => {
      if(user) {
        req.user = user;
        next();
      } else {
        res.status(404).json({ message: "Invalid user Id" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Error"});
    })
}

function validateUser(req, res, next) {
  // do your magic!
  const body = req.body;
  if (body === {}) {
    res.status(400).json({ message: "Missing user data" });
  } else if (!body.name) {
    res.status(400).json({message: "Missing Required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // do your magic!
  const body = req.body;
  
  if (!body) {
    res.status(400).json({ message: "Missing post data" });
  } else if (!body.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
