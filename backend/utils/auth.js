const jwt = require('jsonwebtoken')
const { jwtConfig } = require('../config')
const { User } = require('../db/models')
const { secret, expiresIn } = jwtConfig

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Creates the token
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username
    }

    const token = jwt.sign(
        {
            data: safeUser
        },
        secret,
        {
            expiresIn: parseInt(expiresIn) // 604,800 seconds which is one week
        }
    )

    const isProduction = process.env.NODE_ENV === 'production';

    // This will provide the token cookie to the user
    res.cookie('token', token, {
        maxAge: expiresIn * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && 'Lax'
    })

    return token
}

// This restores our user using the jwt. We will use this for other middlewares to authenticate the user
const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies
    req.user = null

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) return next();

        try {
            const { id } = jwtPayload.data
            req.user = await User.findByPk(id, {
                attributes: {
                    include: ['email', 'createdAt', 'updatedAt']
                }
            })
        } catch (e) {
            res.clearCookie('token')
            return next()
        }

        if (!req.user) res.clearCookie('token')

        return next()
    })
}

const requireAuth = function (req, _res, next){
    if (req.user) return next();

    const err = new Error('Authentication required.')
    err.title = 'Authentication required'
    err.errors = {
        message: 'Authentication required'
    }
    err.status = 401
    return next(err)
}


module.exports = {
    setTokenCookie, restoreUser, requireAuth
}
