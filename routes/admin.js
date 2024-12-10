const { Router, application } = require('express');
const { z } = require('zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { AdminModel } = require('../dbSchema');

const adminRouter = Router();



adminRouter.post('/signup' , async (req , res) => {
    // Input Validation, HASHING , STORING TO THE DATABASE!(try,catch)

    const requiredBody = z.object({
        fullname: z.string().min(3).max(100),
        adminname: z.string().min(3).max(50),
        email: z.string().email(),
        password: z.string().min(3).max(50)
    })

    // Now Parse the req.body to the requiredBody!

    const parsedDataWithSuccess = requiredBody.safeParse(req.body);

    // Ive to implement the if else here that whther the user/admin has given us the valid data or not
    // we've to stop and inform them right to reenter the data if its not in proper valid format!

    if (!parsedDataWithSuccess.success) {
        res.status(400).json({
            msg: "Invalid Format Data Given!",
            errors: parsedDataWithSuccess.error.issues
        })
        return
    }

    // Uptill here our INPUT VALIDATION is done 
    // NOW PROCESS WITH THE SIGNUP FOR THE ADMIN!!!!

    const { fullname , adminname , email , password } = req.body;

    let errorFound = false;
    try {
        const hasedPassword = await bcrypt.hash(password , 10);

        await AdminModel.create({
            fullname: fullname,
            adminname: adminname,
            email: email,
            password: hasedPassword
            // password: password
        });
    }
    catch(e) {
        res.status(400).json({
            msg: `${adminname} Already Registered to our database!`
        })
        errorFound = true;
    }

    if (!errorFound) {
        res.json({
            msg: `${adminname} Successfully SignedUP to the database, as ADMIN!`
        })
    }
})

adminRouter.post('/signin' , async (req , res) => {
    // FIrst of all make sure that the particular user/admin is present in our database or not!

    // INput validation: zod

    const requiredBody = z.object({
        adminname: z.string().min(3).max(50),
        password: z.string().min(3).max(50)
    })

    // parse the req.body to the requiredBody

    const parsedDataWithSuccess = requiredBody.safeParse(req.body);
    
    if (!parsedDataWithSuccess.success) { 
        res.status(400).json({
            msg: "INVALID ADMINNAME OR PASSWORD",
            error: parsedDataWithSuccess.error.issues
        })
        return
    }

    // UPTILL HERE THE INPUT VALIDATION IS DONE!!!

    const { adminname , password } = req.body;

    // now , check if the admin exists in our database or not!
    
    const admin = await AdminModel.findOne({
        adminname: adminname
    })

    if (!admin) {
        res.status(401).json({
            msg: `${adminname} Doesn't exists in our database!`
        })
        return
    }

    const decryptedPassoword = await bcrypt.compare(password , admin.password);

    // CHECK IF THE USERNAME AND PASSWORD MATCHED OR NOT!!

    if (!decryptedPassoword) {
        res.status(403).json({
            msg: "Admin not Found, INCORRECT CREDENTIALS!!"
        })
    }
    else { // MAIN LOGIC: HERE ASSIGN THE JWT TO THE ADMIN
        const token = jwt.sign({
            id: admin._id
        } , process.env.JWT_ADMIN_SECRET);

        res.json({
            msg: `${admin.adminname} Successfully LoggedIN!!`,
            email: admin.email,
            token: token
        })
    }
})

module.exports = {
    adminRouter: adminRouter
}