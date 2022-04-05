const express = require("express");
const path = require("path");
const upload = require("express-fileupload");
const AppError = require("./AppError");
const catchAsync = require("./utils/catchAsync");
const Logger = require("./utils/Logger");
const methodOverride = require("method-override");
const axios = require("axios");
const ejsMate = require("ejs-mate");

const app = express();

function fileDownload(path, res) {
    return new Promise((resolve, reject) => {
        res.download(path, "result.csv", (err) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.engine("ejs", ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views')))
app.use(methodOverride("_method"));
app.use(upload());

app.get("/", (req, res) => {
    res.render("index");
});

function generateTempName() {
    return new Date().getTime()
}


app.post("/", catchAsync(async (req, res) => {
    const logger = new Logger()
    if (req.files) {
        const postfix = generateTempName()

        logger.log(`Received request. Postfix - ${postfix}`)

        const file = req.files.file;
        await file.mv(`./uploads/file_${postfix}.csv`, async (err) => {
            if (err) {
                logger.error(`Unable to download file as file_${postfix}.csv`)
                throw new AppError(err);
            } else
            {
                logger.error("File downloaded. Running the script")
                logger.log("Script has finished working. Uploading file")
            }
        });
    } else {
        logger.warn("Received request, but no file provided")
        throw new AppError("no file provided", 400);
    }
}));

app.listen(3000, () => {
    console.log("Listening оn port 3000");
});
