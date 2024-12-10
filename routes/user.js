const { Router } = require('express');

const userRouter = Router();

userRouter.get("/" , (req , res) => {
    res.json({
        msg: "THIS IS THE HOMEPAGE FOR USER!!!, EVERYTHING WORKING FINE!!!"
    })
})


module.exports = {
    userRouter: userRouter
}