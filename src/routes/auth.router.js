const router = require('express').Router()
const auth = require('../controllers/auth.controller')
const {isAdmin, isUser, isLoggedIn} = require('../middleware/auth.middleware')
const {login, refresh, logout} = require('../controllers/auth.controller')

router.post('/login', login)
router.post('/refresh', refresh)
router.get('/logout', logout)

module.exports = router