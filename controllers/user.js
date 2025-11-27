const user = require("../models/user");

module.exports.rendersignup=  (req, res) => {
  res.render("users/signup.ejs");
};
 
module.exports.signup = async (req, res,next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    console.log(registeredUser);
    req.login(registeredUser,(err) =>
    {
        if(err)
        {
            return next(err);
        }
          req.flash("success", "Welcome to Wanderlust!");
    res.redirect("/listings");
    });

  
  } catch (e) {
    req.flash("error", e.message);
    res.render("users/signup.ejs"); // ✅ fixed
  }
};
module.exports.renderlogin = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async(req, res) => {
    req.flash("success", "Welcome back to Wanderlust! You successfully logged in.");
    let redirectUrl = res.locals.redirectUrl ||"/listings";
    res.redirect(redirectUrl);
  };

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out");
    res.redirect("/listings");
  });
};
// controllers/users.js
const User = require("../models/user");

module.exports.signup = async (req, res, next) => {
    try {
        // Log 1: Check incoming data
        console.log("--- 1. Signup Route Hit. Data Received: ---");
        console.log(req.body);

        const { username, email, password } = req.body;
        const newUser = new User({ email, username });

        // Log 2: Attempting to save to MongoDB
        console.log("--- 2. Attempting to register user in DB... ---");
        const registeredUser = await User.register(newUser, password);

        // Log 3: Success
        console.log("--- 3. User Registered Successfully: ---");
        console.log(registeredUser);

        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });

    } catch (e) {
        // Log 4: Error Handling
        console.log("--- 4. SIGNUP ERROR OCCURRED: ---");
        console.log(e.message); // <--- Sabse zaroori line ye hai
        console.log("-----------------------------------");

        req.flash("error", e.message);
        res.redirect("/signup");
    }
};