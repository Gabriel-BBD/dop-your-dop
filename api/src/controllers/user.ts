import express from 'express';

const userRouter = express.Router();

userRouter.post<{}, any>('/drink', (req, res) => {

    res.json({
        message: `will post our user drink here`
    })
})

export default userRouter;