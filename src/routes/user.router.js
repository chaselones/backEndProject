const router = require('express').Router()
let User = require('../controllers/user.controller')

router.route('/')
    .get()
    .post()

router.route('/:id')
    .get()
    .delete()
    .put()
    .patch()

module.exports = router