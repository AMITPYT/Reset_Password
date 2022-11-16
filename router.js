const express = require("express");
const router = express.Router();
const User = require('./Schema/models');
const User1 = require('./Schema/mail_models');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const otp = require("./Schema/mail_models");
const { response } = require("express");

// const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Amitisagoodb$oy'
router.post('/register', async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ success, errors: "Sorry a user with this email already exists" });

        }
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)
        const secPass1 = await bcrypt.hash(req.body.cpassword, salt)
        const userdata = new User({
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            phone: req.body.phone,
            password: secPass,
            cpassword: secPass1,

        });
        // const passwordcompare = await bcrypt.compare(userdata.password, userdata.cpassword);
        if (secPass !== secPass1) {
            return res.status(400).send("Password does not matched");
        }
        // if(userdata == null){
        //     return res.status(400).send({userdata:"Please fillUp all the categorys!!"});
        // }
        // const data = {
        //     userdata: {
        //         _id: userdata.id
        //     }
        // }
        // const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        // res.json({success, authtoken })
        const Createuser = await userdata.save();
        res.status(201).send(Createuser);
        // response.setHeader("Content-Type", "application/json");

    } catch (error) {
        console.error(error.message);
        res.status(400).send(error);

    }

})

router.post('/login', [
    body('email', 'Enter the valid email').isEmail(),
    body('password', 'password cannot be blank').exists(),
], async (req, res) => {
    let success = false;
    // if there are errors, return Bad request and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        // Check the user if the user already exists than gave this error
        let user = await User.findOne({ email });
        if (!user) {
            success = false
            return res.status(400).json({ errors: "Please try to login with correct account" });
        }
        // check the user password was correct or not
        const passwordcompare = await bcrypt.compare(password, user.password);
        if (!passwordcompare) {
            success = false
            return res.status(400).json({ success, errors: "Please try to login with correct password" });
        }
        else {
            res.send("Login sucessfull")
        }

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
});
router.get('/getuser/:id', async (req, res) => {
    try {
        // user = req.params.id;
        const user = await User.findById(req.params.id)
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
});
router.get('/getuser', async (req, res) => {
    try {
        // user = req.params.id;
        const user = await User.find()
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
});

router.delete('/deleteuser/:id', async (req, res) => {
    try {
        // user = req.params.id;
        const user = await User.findByIdAndDelete(req.params.id)
        res.send(user)
        console.log("Delete SucessFully");
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error")
    }
});

router.post('/emailSend', async (req, res) => {
    let data = await User.findOne({ email: req.body.email });
    console.log(data);
    const resType = {}
    if (data) {
        let otpcode = Math.floor((Math.random() * 10000) + 1);
        let otpData = new User1({
            email: req.body.email,
            code: otpcode,
            expire: new Date().getTime() + 300 * 1000
        })
        let otpResponse = await otpData.save();
        resType.statusText = "Success"
        // mailer("tejim47660@jernang.com", 5698)
        resType.message = "Please the check your email I'd"
    }
    else {
        resType.statusText = "Failed"
        resType.message = "Email id does not exist"
    }
    res.status(200).json(resType)

})

router.post('/ChangePassword', async (req, res) => {
    let data = User1({ email: req.body.email, code: req.body.otpCode })
    const response = {};
    if (data) {
        let currentTime = new Date().getTime();
        let diff = data.expire - currentTime;
        if (diff < 0) {
            response.statusText = "error"
            response.message = "OTP has been expireed"
        }
        else {
            let user = await User.findOne({ email: req.body.email });
            console.log(user);
            user.password = req.body.password;
            user.cpassword = req.body.cpassword;
            if (user.password !== user.cpassword) {
                return res.status(400).send("Password does not matched");
            }
            user.password = await bcrypt.hash(req.body.password, 10)
            user.cpassword = await bcrypt.hash(req.body.cpassword, 10)
            user.save();
            response.statusText = "Success"
            response.message = "Password changed Successfully"
        }
    }
    else {
        response.statusText = "error"
        response.message = "Invalid otp"
    }


    res.status(200).json(response)
})

const mailer = (email, otp) => {

    var nodemailer = require("nodemailer");

    var transporter = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        secure: false,
        auth: {
            user: 'amitkumar171117@gmail.com',
            pass: 'Am!t261102'
        }
    });

    var mailoption = {
        form: 'amitkumar171117@gmail.com',
        to: 'tejim47660@jernang.com',
        subject: 'Sending Mail using Nodejs',
        text: 'hahaha'
    };
    transporter.sendMail(mailoption, function (error, Info) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent to: ' + Info.response);
        }
    });
}

module.exports = router;