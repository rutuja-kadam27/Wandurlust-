if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride =require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter= require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
//const expressLayouts = require("express-ejs-layouts");

app.set("view engine" ,"ejs");
//app.use(expressLayouts);

app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname, "public")));
//for connecting the css file to the app.js
//app.set("layout", "layouts/boilerplate");
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';;
const dbURL = "mongodb+srv://rutujakadamsitscomp_db_user:EO4nNqfSXPMcZfbv@cluster0.kfbgacc.mongodb.net/wanderlust?appName=Cluster0";
main()
  .then(() => {
    console.log("✅ Connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbURL);
};


const store = MongoStore.create({
  mongoUrl: dbURL,
  // crypto: {
  //   secret: "mysupersectretcode",
  // },
  touchAfter: 24 * 3600, // seconds
});

store.on("error", (err) => {
  console.log("Error in mongo session", err);
});
const sessionOptions = 
{
  store,
  secret : "mysupersectretcode",
  resave : false,
  saveUninitialized : true,
  cookie:
  {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge  :7 * 24 * 60 * 60 * 1000,
    httpOnly : true
  }
};

// 


//for authentication by using passport library
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});
app.use((req, res, next) => {
  res.locals.currUser = req.user;   // Make currUser available in all EJS views
  next();
});


// app.get("/demouser", async(req,res) =>
// {
//    let fakeUser = new User(
//     {
//       email:"student@gmail.com",
//       username: "delta",
//     }
//    );
//     let registerUser = await User.register(fakeUser,"abcd");
//     res.send(registerUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

// app.get("/testListing",(req,res) =>
// {
//   let sampleListing =new Listing(
//     {
//         title: "My new villa",
//         description: "By the beach",
//         price: 12000,
//         location:"Alibag ",
//         country:"India",
//     }
//   );
//   sampleListing.save().then(() => {
//     console.log("sample was savesd");
//     res.send("succesfull testing");

// }).catch(err =>
// {
//    console.log(err);
// })
// });
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page not found !!"));
// });
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404,"Page Not Found"));
});
// app.use((err, req, res, next) => {
//     console.log("Error middleware hit:", err); // ✅ Log the error
//     const { statusCode = 500, message = "Something went wrong" } = err;
//     res.render("error.ejs");
//     //res.status(statusCode).send(message);
// });
// Catch-all error handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error", { message });
});

app.listen(8080, () => 
{
    console.log("server is listning ");
})
