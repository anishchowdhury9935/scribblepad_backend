const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User_data = require('../models/User');
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'anish9982';

// endpoint for creating new user "http://127.0.0.1:5000/api/users/auth/CreateUser"

router.post('/CreateUser', [
    body('email', 'Enter a valid email').isEmail(),
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('password', 'Enter at least 8 lenght of password').isLength({ min: 8 })
], async (req, res) => {
    // Finds the validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // check if user is user already existing
    let userexist = await User_data.findOne({ email: req.body.email });
    if (userexist) {
        return res.status(400).send('This user already exists');
    }

    const data = {
        user: {
            id: User_data.id
        }
    }
    const authdata = jwt.sign(data, JWT_SECRET)
    // password hasing
    let salt = await bcrypt.genSalt(10);
    const secpass = await bcrypt.hash(req.body.password, salt);
    // create new user
    user = await User_data.create({
        name: req.body.name,
        password: secpass,
        email: req.body.email
    }).then(res.json({ authdata }));
});

// endpoint for login user "http://127.0.0.1:5000/api/users/auth/Login"

router.post('/Login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'password can not be blank').isLength({ min: 8 })
], async (req, res) => {
    // Finds the validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User_data.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ errors: `Invalid username or password` });
        }
        const passwordcompare = await bcrypt.compare(password, user.password);
        if (!passwordcompare) {
            return res.status(400).json({ errors: `Invalid username or password` });
        }
        const data = user.id
        const authdata = jwt.sign(data, JWT_SECRET)
        res.json({ authdata })
    } catch (error) {
        res.status(400).json({ "error": `some internal server error` })
    }
});

// User logined data "http://127.0.0.1:5000/api/users/auth/getUser"

router.get('/getUser', fetchuser, async (req, res) => {

    try {
        let userId = await req.user
        const user = await User_data.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})


module.exports = router;