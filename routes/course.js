const { Router } = require('express');

const courseRouter = Router();

const { CourseModel } = require('../dbSchema');

courseRouter.get('/preview' , async (req , res) => {
    const courses = await CourseModel.find({}); // ALL AVAILABLE COURSES!

    res.json(courses);
})

module.exports = {
    courseRouter: courseRouter
}