const router = require('express').Router();
const sessionRouter = ('./session.js')
const usersRouter = ('./users.js')
const { restoreUser } = require('../../utils/auth.js')

// This reaches our restoreUser middleware and checks the token to restore the user
// If the current session is valid, restoreUser sets the req.user to the user in the db
// If not, the req.user is then null
router.use(restoreUser)

router.use('/session', sessionRouter)

router.use('/users', usersRouter)

router.post('/test', (req, res) => {
    res.json({
        requestBody: req.body
    })
})


module.exports = router
