const { Router } = require('express');
const { z } = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userRouter = Router();

const { UserModel, PurchaseModel } = require('../dbSchema');
const { userAuthentication } = require('../middlewares/userauth');


userRouter.post('/signup' , async (req , res) => {
    // Input Validation, HASHING , STORING TO THE DATABASE!(try,catch)

    const requiredBody = z.object({
        fullname: z.string().min(3).max(100),
        username: z.string().min(3).max(50),
        email: z.string().email(),
        password: z.string().min(3).max(50)
    })

    // Now Parse the req.body to the requiredBody!

    const parsedDataWithSuccess = requiredBody.safeParse(req.body);

    // Ive to implement the if else here that whther the user/admin has given us the valid data or not
    // we've to stop and inform them right to reenter the data if its not in proper valid format!

    if (!parsedDataWithSuccess.success) {
        res.status(400).json({
            message: "Invalid Format Data Given!",
            errors: parsedDataWithSuccess.error.issues
        })
        return
    }

    // Uptill here our INPUT VALIDATION is done 
    // NOW PROCESS WITH THE SIGNUP FOR THE ADMIN!!!!

    const { fullname , username , email , password } = req.body;

    let errorFound = false;
    try {
        const hasedPassword = await bcrypt.hash(password , 10);

        await UserModel.create({
            fullname: fullname,
            username: username,
            email: email,
            password: hasedPassword
            // password: password
        });
    }
    catch(e) {
        res.status(400).json({
            message: `${username} Already Registered to our database!`
        })
        errorFound = true;
    }

    if (!errorFound) {
        res.json({
            message: `${username} Successfully SignedUP to the database, as USER!`
        })
    }
})

userRouter.post('/signin' , async (req , res) => {
    // FIrst of all make sure that the particular user/admin is present in our database or not!

    // INput validation: zod

    const requiredBody = z.object({
        username: z.string().min(3).max(50),
        password: z.string().min(3).max(50)
    })

    // parse the req.body to the requiredBody

    const parsedDataWithSuccess = requiredBody.safeParse(req.body);
    
    if (!parsedDataWithSuccess.success) { 
        res.status(400).json({
            message: "INVALID USERNAME OR PASSWORD",
            error: parsedDataWithSuccess.error.issues
        })
        return
    }

    // UPTILL HERE THE INPUT VALIDATION IS DONE!!!

    const { username , password } = req.body;

    // now , check if the admin exists in our database or not!
    
    const user = await UserModel.findOne({
        username: username
    })

    if (!user) {
        res.status(401).json({
            message: `${username} Doesn't exists in our database!`
        })
        return
    }

    const decryptedPassoword = await bcrypt.compare(password , user.password);

    // CHECK IF THE USERNAME AND PASSWORD MATCHED OR NOT!!

    if (!decryptedPassoword) {
        res.status(403).json({
            message: "User not Found, INCORRECT CREDENTIALS!!"
        })
    }
    else { // MAIN LOGIC: HERE ASSIGN THE JWT TO THE ADMIN
        const token = jwt.sign({
            id: user._id
        } , process.env.JWT_USER_SECRET);

        res.json({
            message: `${user.username} Successfully LoggedIN!!`,
            email: user.email,
            token: token
        })
    }
})

// Authenticated Endpoint!
userRouter.get('/purchases' , userAuthentication , async (req , res) => {
    const userId = req.userId;

    const purchases = await PurchaseModel.find({
        userId: userId
    })

    res.json(purchases)

    
        
})

module.exports = {
    userRouter: userRouter
}