const router = require('express').Router()
let user = require('../controllers/user.controller')

router.route('/')
    .get(user.list)
    .post(user.create)

router.route('/:id')
    .get(user.read)
    .delete(user.delete)
    .put(user.update)
    .patch(user.update)

module.exports = router