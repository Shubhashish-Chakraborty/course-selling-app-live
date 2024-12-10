const { Router, application } = require('express');
const { z } = require('zod');
const bcrypt = require('bcrypt');

const { AdminModel } = require('../dbSchema');

const adminRouter = Router();



adminRouter.post('/signup' , async (req , res) => {
    // Input Validation, HASHING , STORING TO THE DATABASE!(try,catch)

    const requiredBody = z.object({
        fullname: z.string().min(3).max(100),
        adminname: z.string().min(3).max(10),
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


module.exports = {
    adminRouter: adminRouter
}