import dotenv from "dotenv"
dotenv.config()
import express from "express"
import { dbConnect } from "./config/db.js"
import cors from "cors"
import authroutes from "./routes/userRoutes.js"
import proflieRoutes from "./routes/profileRoutes.js"
import postRoutes from "./routes/PostRoutes.js"
import homeroutes from "./routes/Homeroutes.js"
import grouproutes from "./routes/GroupRoutes.js"

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));


app.use("/auth",authroutes)
app.use("/profile",proflieRoutes)
app.use("/post",postRoutes)
app.use("/home",homeroutes)
app.use("/group",grouproutes)



dbConnect();

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.info(`server runnig on ${process.env.PORT} port`);
});

