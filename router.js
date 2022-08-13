const express = require("express");
const router = express.Router();
const User = require('./models');
const bcrypt = require('bcryptjs');
// var jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
// const fetchuser = require('../middleware/fetchuser');

// const JWT_SECRET = 'Amitisagoodb$oy'
router.post('/register', async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
        // let user = await User.findOne({email: req.body.email})
        // if(user){
        //     return res.status(400).json({success, errors:"Sorry a user with this email already exists"});

        // }
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

}   )

// router.post('/login', async (req, res) => {
//         let success = false;
//         // if there are errors, return Bad request and the error
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).send(errors);
//         } 
 
//             const { email, password} = req.body;
        
//         try {
//             // Check the user if the user already exists than gave this error
//             let user = await User.findOne({email});
//             if (!user) { 
//                 success = false
//                 return res.status(400).send( {errors:"Please try to login from another account"});
//             }
//             // check the user password was correct or not
//             const passwordcompare = await bcrypt.compare(password, user.password);
//             if (!passwordcompare) {
//                 success = false
//                 return res.status(400).send({success, errors:"Please try to login with correct password"});
//             }

//             const data = {
//                 user: {
//                     _id: user.id
//                 }
//             }
//             const authtoken = jwt.sign(data, JWT_SECRET);
//             success = true;
//             res.json({success, authtoken })
//             // const Loginuser = await user.save();
//             // res.status(201).send(Loginuser);

//         } catch (error) {
//             console.error(error.message);
//             res.status(500).send("Internal server error")
//         }
// });
router.get('/getuser/:id', async (req, res) =>{
    try { 
        // user = req.params.id;
        const user = await User.findById(req.params.id)
        res.send(user) 
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error") 
    }
});
router.get('/getuser', async (req, res) =>{
    try { 
        // user = req.params.id;
        const user = await User.find()
        res.send(user) 
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error") 
    }
});

router.delete('/deleteuser/:id', async (req, res) =>{
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


module.exports = router;