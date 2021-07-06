const express = require('express');
const postDb = require('./postDb.js');
const router = express.Router();

router.get('/', (req, res) => {
  // do your magic!
  console.log("hi from post");
  postDb
    .get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({ error: "Error" });
    });
});

router.get('/:id', (req, res) => {
  // do your magic!
  const { id } = req.params;
  postDb
    .getById(id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err => {
      res.status(500).json({ error: "The post could not be found by that id" });
    });
});

router.delete('/:id', (req, res) => {
  // do your magic!
  const { id } = req.params;
  postDb
    .remove(id)
    .then(post => {
      if (post) {
        res.status(200).json({ message: `Post ${id} deleted` });
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err =>
      res.status(500).json({ error: "The post could not be removed" })
    );
});

router.put('/:id', validatePostId, (req, res) => {
  // do your magic!
  const { id } = req.params;
  postDb
    .update(id, req.body)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." });
      }
    })
    .catch(err =>
      res.status(500).json({ error: "The post could not be modified" })
    );
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
  const { id } = req.params;
  postDb
    .getById(id)
    .then(post => {
      if (post) {
        req.post = post;
        next();
      } else {
        res.status(500).json({ massage: "Error" })
      }
    })
    .catch(err => {
      res.status(500).json({ error: "Error" });
    });
}

module.exports = router;
