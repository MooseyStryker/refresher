const router = require('express').Router();
const { restoreUser } = require('../../utils/auth.js')

// This reaches our restoreUser middleware and checks the token to restore the user
// If the current session is valid, restoreUser sets the req.user to the user in the db
// If not, the req.user is then null
router.use(restoreUser)


module.exports = router
