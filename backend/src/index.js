import dotenv from "dotenv"
dotenv.config()
import express from "express"
import { dbConnect } from "./config/db.js"
import cors from "cors"
import authroutes from "./routes/userRoutes.js"


const app = express()
app.use(express.json())
app.use(cors())


app.use("/auth",authroutes)

dbConnect();

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.info(`server runnig on ${process.env.PORT} port`);
});

