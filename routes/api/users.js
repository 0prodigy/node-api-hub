const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const passport = require('passport');
//Load Validators 
const validateRegisterInput = require('../../valIdator/register');
const validateLoginInput = require('../../valIdator/login');
// Load Mnogoose User module
const User = require('../../models/User')
const key = require('../../config/key')



// @route GET api/users/test
// @desc Tets users route
// @access  Public

router.get('/register', (req, res) => {
    res.json({
        msg: "users works"
    })
});

// @route Post api/users/register
// @desc register users 
// @access  Public

router.post('/register', (req, res) => {
    const { error, isValid } = validateRegisterInput(req.body);

    if (isValid) {
        error.name = "Wromg ane"
        return res.status(400).json(error);
    }


    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                error.email = "Email Already Register"
                return res.status(400).json(error);
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: "200", //size
                    r: "pg", //RAting
                    d: "mm" //default
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                });
                console.log(newUser);

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(newUser))
                            .catch(err => console.log("err"))

                    });
                });
            }
        }).catch(err => res.json(err));
});

// @route GET api/users/register
// @desc register users 
// @access  Public 

router.post('/login', (req, res) => {
    const { error, isValid } = validateLoginInput(req.body);
    // res.json({email: req.body.email,  password:req.body.password})
    if (isValid) {
        return res.status(400).json({ error: "invalid" });
    }
    const email = req.body.email;
    const password = req.body.password;
    //find for user
    User.findOne({ email })
        .then(user => {
            if (!user) {
                error.email = "Email Not Found"
                return res.json(error);
                console.log("email not found");

            }
            //check  passowrd
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        //user Matched
                        const payload = { id: user.id, name: user.name, avatar: user.avatar }

                        jwt.sign(payload, key.secretOrKey, { expiresIn: 3400 }, (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            })
                        })
                    } else {
                        errors.password = "Wrong Password"
                        return res.status(400).json(error);
                    }
                }).catch(err => {
                    console.log(err);
                    res.json(err)
                });
        });
});

// @route GET api/users/current
// @desc return current users 
// @access  Private 
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ msg: "success" })
})

module.exports = router;