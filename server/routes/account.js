const router = require('express').Router();
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// imports
const User = require('../models/user');
const keys = require('../config/keys');

// creating the router to register an account
router.post('/register', (req, res ) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            // checking for the user
            if(user) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exist'
                });
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });
                // creating new user
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                    isSeller: req.body.isSeller,
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    })
                })
            }
        })
});

// creating the router to login an account
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // find the user by email
    User.findOne({email})
        .then(user => {
            // check user
            if(!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Email not found'
                });
            }
            // check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                     // user matched
                        const payload = { id: user.id, name: user.name, avatar: user.avatar}
                    // sign token
                    jwt.sign(
                        payload, 
                        keys.secret, 
                        {expiresIn: 3600}, 
                        (err, token) =>  {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            });
                    });
                    } else {
                        return res.status(400).json({
                            success: false,
                            message: 'Password incorrect'
                        });
                    }
                });
        });
});

module.exports = router;