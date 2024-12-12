const { Router } = require('express');

const courseRouter = Router();

const { CourseModel, PurchaseModel } = require('../dbSchema');

const { userAuthentication } = require('../middlewares/userauth');

courseRouter.get('/preview' , async (req , res) => {
    const courses = await CourseModel.find({}); // ALL AVAILABLE COURSES!

    res.json(courses);
})

courseRouter.post('/purchase' , userAuthentication , async (req , res) => {
    const userId = req.userId;

    const { courseId } = req.body;

    // We've to check that whether that course is available or not!!

    const courseExistance = await CourseModel.findOne({
        _id: courseId
    })

    if (!courseExistance) {
        res.status(400).json({
            message: "NO COURSE AVAILABLE!!!"
        })
        return
    }

    // WE've to prevent the user to buy a course twice.

    const alreadyPurchased = await PurchaseModel.findOne({
        courseId: courseId
    })

    if (alreadyPurchased) {
        res.status(400).json({
            message: "This course has already been purhcased!!"
        })
        return
    }

    await PurchaseModel.create({
        userId: userId,
        courseId: courseId
    })

    res.json({
        message: "Course has been successfully purchased!"
    })

})

module.exports = {
    courseRouter: courseRouter
}