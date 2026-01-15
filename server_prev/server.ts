import express, { Express } from "express"
import path from "path"
//import router from "./src/routes/index"
import cors, {CorsOptions} from 'cors'
import morgan from "morgan"
import mongoose, { Connection } from 'mongoose'
import dotenv from "dotenv"

import userRouter from "./src/routes/user"
import documentRouter from "./src/routes/document"; 

dotenv.config()

const app: Express = express()
const port: number = parseInt(process.env.PORT as string) || 1234

console.log("NODE_ENV:", process.env.NODE_ENV);

const corsOptions: CorsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))

const MONGO_URL = 'mongodb://127.0.0.1:27017/testdb';

mongoose.connect(MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB:", mongoose.connection.name);
});


/*
db.on("error", console.error.bind(console, "MongoDB connection error"))
db.once("open", () => {
  console.log("Connected to MongoDB!");
});*/

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan("dev"))


//app.use(express.static(path.join(__dirname, "./public")))
//app.use("/api/user/", router)


app.get("/", (req, res) => {

    res.status(200).json({ message: "Server is running!" })
    //res.sendFile(path.join(__dirname, "./public/index.html"));
});


app.use("/api/user", userRouter)
app.use("/api/document", documentRouter)
//app.use("/api", topicRouter)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
    const MONGO_URL = 'mongodb://127.0.0.1:27017/testdb';

    /*
    try {
        mongoose.connect(MONGO_URL);

        mongoose.connection.on("connected", () => {
            console.log("Connected to MongoDB:", mongoose.connection.name);
        });
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error}`)

    }*/
})