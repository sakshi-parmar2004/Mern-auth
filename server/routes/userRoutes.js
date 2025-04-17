import express from "express";
import { getData } from "../controllers/userControllers.js";
import { userAuth } from "../middleware/userAuth.js";

const userRouter = express.Router();


userRouter.get('/data',userAuth, getData );


export default userRouter
