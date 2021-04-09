const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const methodOverride = require("method-override");
const ExpressError = require("./utilities/ExpressError");
const flash = require("connect-flash");
const csv = require("csv-parser");
const multer = require("multer");
const fs = require("fs");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const Examinar = require("./models/staff");
const Candidate = require("./models/staff");
const results = [];
const bodyParser = require("body-parser");

global.__basedir = __dirname;

//require the routes
const questionRoutes = require("./routes/questions");
const staffRoutes = require("./routes/staff");
const candidateRoutes = require("./routes/candidates");
const examRoutes = require("./routes/exams");
const resultRoutes = require("./routes/results");

//connection to the database mongodb+srv://admin-promise:locexamspc6@cluster0.ustfc.mongodb.net
// mongodb://localhost:27017
mongoose.connect("mongodb+srv://admin-promise:locexamspc6@cluster0.ustfc.mongodb.net/loc-exams", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection; //bind mongoose.connection to db

db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
  console.log("Database Connected!");
});

//create an express application
const app = express();

app.use(express.json());

//app to use ejsMate
app.engine("ejs", ejsMate);

//set views engine to ejs
app.set("view engine", "ejs");

//define the absolute path to the views directory
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true })); //middleware to parse the body
app.use(methodOverride("_method")); //use method override for RESTful routes
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  secret: "thisismysecretuyuyuyuyuyurt",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

//passport middleware -consistent login
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Examinar.authenticate())); //generate a function in LocalStrategy for authentication

//how to store and unstore staff from the session
passport.serializeUser(Examinar.serializeUser());
passport.deserializeUser(Examinar.deserializeUser());

//how to store and unstore candidate from the session
// passport.serializeUser(Candidate.serializeUser());
// passport.deserializeUser(Candidate.deserializeUser());

//middleware to handle flash.
app.use((req, res, next) => {
  res.locals.currentStaff = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//file upload start

//create the file storage engine using multer
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./csv");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: fileStorageEngine,
});

const pathFile = "./csv/data.csv";

app.post("/upload", upload.single("candidates"), async (req, res) => {
  // console.log(req.file);
  try {
    //check if the file exists before saving to DB
    if (fs.existsSync(pathFile)) {
      //file exists
      console.log("File exists");
      fs.createReadStream("./csv/data.csv")
        .pipe(csv({}))
        .on("data", (data) => results.push(data))
        .on("end", async () => {
          console.log(results);
          for (let person of results) {
            //generate a random password for each candidate
            const password = (passwordId) =>
              Math.floor(Math.random() * 999999) + 10000;
            //pass along side the data form Excel the password for each candidate
            const newCandidate = new Candidate({ ...person });
            //save the candidate to the database
            const newPassword = password();
            const candidatePassword = `LOC${newPassword}`;
            // console.log(candidatePassword);
            newCandidate.passcode = candidatePassword;
            const registeredCandidate = await Candidate.register(
              newCandidate,
              candidatePassword
            );

            // await newCandidate.save();
          }
        });
      res.redirect("/staff/dashboard");
    } else {
      console.log("File does not exist");
    }
  } catch (err) {
    console.error(err);
  }

  //or redirect here/
});
//file upload end

//middleware to use the routes
app.use("/candidate", candidateRoutes);
app.use("/staff", staffRoutes);
app.use("/candidate/exam/results", resultRoutes);
app.use("/staff/dashboard/exams", examRoutes);
app.use("/staff/dashboard/exams/:id/question", questionRoutes);

//route to serve the homepage
app.get("/", (req, res) => {
  res.render("home");
});
//other routes

//route to handle 404
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

//async error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("error", { err });
});

let port = process.env.PORT;

if (port == null || port == "") {
  port = 3000;
}

app.listen(3000, () => {
  console.log("App serving on port 3000");
});
