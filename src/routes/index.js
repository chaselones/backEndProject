// index for all routes:
const router = require('express').Router()
const userRouter = require('./user.router')
const authRouter = require('./auth.router')

router.use('/users', userRouter)
router.use('/auth', authRouter)

router.all('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' })
})

module.exports = router