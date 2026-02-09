import express from "express";
import path from "node:path";
import {fileURLToPath} from "node:url";
import session from "express-session";
import {initializePassport} from "./middleware/passport.js";
import setUserLocals from "./middleware/setUserLocals.js";
import indexRouter from "./routes/indexRouter.js";
import signUpRouter from "./routes/signUpRouter.js";
import signInRouter from "./routes/signInRouter.js";
import fileUploadRouter from "./routes/fileUploadRouter.js";
import folderRouter from "./routes/folderRouter.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const passportInstance = initializePassport();

app.use(session({secret: "cats", resave: false, saveUninitialized: false}));
app.use(passportInstance.initialize());
app.use(passportInstance.session());
app.use(setUserLocals);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.use("/folder", folderRouter);
app.use("/sign-up", signUpRouter);
app.use("/sign-in", signInRouter);
app.use("/upload-file", fileUploadRouter);
app.use("/", indexRouter);




const port = 3000;

app.listen(port, () => {
    console.log(`running at port: ${port}`)
})