if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const port = 8080;
//connect mongo db
const mongoose = require("mongoose");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const dbUrl = process.env.ATLASDB_URL;

//require listing
// const Listing = require("./models/listing.js");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // If you're sending JSON
const methodOverride = require("method-override");
// Use method override with query parameter
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
// const { listingSchema, reviewSchema } = require("./schema.js");
// const Review = require("./models/review.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error", (err) => {
  console.error("Mongo session store error:", err);
});
const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Valid Date object
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    httpOnly: true,
  },
};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// app.post("/listings/new", async (req, res) => {
//   let { tit, desc, img, price, loc, country } = req.body;

//   let addnewList = await Listing({
//     title: tit,
//     description: desc,
//     image: img,
//     price: price,
//     location: loc,
//     country: country,
//   });
//   // console.log(addnewList);
//   addnewList.save();
//   res.redirect("/listings");
// });

//minimize the code

//validate listing

// const validatereview = async (req, res, next) => {
//   let { error } = reviewSchema.validate(req.body);
//   // console.log(error);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, error);
//   } else {
//     next();
//   }
// };

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  // console.log(res.locals.success);
  res.locals.currentUser = req.user;
  next();
});

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "regan@gmail.com",
//     username: "delta-student",
//   });
//   let registerUser = await User.register(fakeUser, "hello1234");
//   console.log(registerUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// new listing add route
// const validateListing = async (req, res, next) => {
//   let { error } = listingSchema.validate(req.body);
//   console.log(error);
//   if (error) {
//     let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400, error);
//   } else {
//     next();
//   }
// };

// app.get(
//   "/listings",
//   wrapAsync(async (req, res) => {
//     let allListing = await Listing.find({});
//     // .then((data) => {
//     //   console.log(data);
//     // })
//     // .catch((err) => {
//     //   console.log(err);
//     // });

//     res.render("./listing/index.ejs", { allListing });
//   })
// );

// app.get("/listings/new", (req, res) => {
//   res.render("./listing/new.ejs");
// });
// app.post(
//   "/listings",
//   validateListing,
//   wrapAsync(async (req, res, next) => {
//     // let list = req.body.listing;
//     // if (!req.body.listing) {
//     //   throw new ExpressError(400, "Send valid data for listing");
//     // }

//     const newlist = new Listing(req.body.listing);

//     // if (!newlist.title) {
//     //   throw new ExpressError(400, "Title is missing");
//     // }
//     // if (!newlist.description) {
//     //   throw new ExpressError(400, "Description is missing");
//     // }
//     // if (!newlist.price) {
//     //   throw new ExpressError(400, "Price is missing");
//     // }
//     // if (!newlist.location) {
//     //   throw new ExpressError(400, "Location is missing");
//     // }
//     // if (!newlist.country) {
//     //   throw new ExpressError(400, "Country is missing");
//     // }
//     await newlist.save();
//     res.redirect("/listings");
//   })
// );

// app.get(
//   "/listings/:id",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let listing = await Listing.findById(id).populate("reviews");

//     res.render("./listing/show.ejs", { listing });
//   })
// );

// app.get("/testListing", async (req, res) => {
//   let sampleListiing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     image:
//       "https://blog.lohono.com/wp-content/uploads/2024/05/Glass-House-41-1024x683.jpg",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });
//   await sampleListiing.save();
//   console.log("sample was saved");
//   res.send("Success full testing");
// });

// app.get(
//   "/listings/:id/edit",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     let listing = await Listing.findById(id);
//     res.render("./listing/edit.ejs", { listing });
//   })
// );

//edit route
// app.patch(
//   "/listings/:id",
//   validateListing,
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
//   })
// );

//delete route

// app.delete(
//   "/listings/:id",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
//   })
// );

// Reviews route

// app.post(
//   "/listings/:id/reviews",
//   validatereview,
//   wrapAsync(async (req, res) => {
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);

//     listing.reviews.push(newReview);
//     // console.log(listing);
//     await newReview.save();
//     await listing.save();
//     res.redirect(`/listings/${listing._id}`);
//   })
// );
// delete review rout
// app.delete(
//   "/listings/:id/reviews/:reviewId",
//   wrapAsync(async (req, res) => {
//     let { id, reviewId } = req.params;
//     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
//   })
// );

app.all(/./, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  // res.status(status).send(message);
  res.status(status).render("error.ejs", { err });
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
