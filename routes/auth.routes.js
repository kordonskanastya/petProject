const {Router, response} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('./models/User')
const router = Router()

// /api/auth/register
router.post(
    '/register', 
    [
        check('email', 'Email error').isEmail(),
        check('password', 'Your password is less than 6 simbols').isLength({min: 6})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorekt data during registration'
            })
        }
        const {email, password} = req.body

        const candidate = await User.findOne({email})

        if (candidate) {
            return res.status(400).json({message: 'This user already exist'})
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({email, password: hashedPassword})

        await user.save()

        res. status(201).json({message: 'User created'})

    } catch (e) {
        response.status(500).json({ message: 'Something whent wring, try again'})
    }
})

// /api/auth/login
router.post(
    '/login', 
    [
        check('email', 'put correct Email').normalizeEmail().isEmail(),
        check('password', 'put correct Password').exists()
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorekt data during log in'
            })
        }

        const {email, password} = req.body

        const user = await User.findOne({email})

        if (!user) {
            return res.status(400).json({message: 'User did not found'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({message: 'Incorrect password, try again'})
        }

        const token = jwt.sign(
            {userId: user.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        )

        res.json({token, userId: user.id})
        
    } catch (e) {
        response.status(500).json({ message: 'Something whent wring, try again'})
    }
    })

module.exports = router