const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  let allListing = await Listing.find({});
  res.render("./listing/index.ejs", { allListing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("./listing/new.ejs");
};

module.exports.addNewLissting = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
  // console.log(response.body.features[0].geometry);

  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url, "..", filename);
  const newlist = new Listing(req.body.listing);
  newlist.owner = req.user._id;
  newlist.image = { url, filename };
  newlist.geometry = response.body.features[0].geometry;

  let saveListing = await newlist.save();
  console.log(saveListing);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  // console.log(listing);
  if (!listing) {
    req.flash("error", "Listings you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("./listing/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listings you requested for does not exist!");
    return res.redirect("/listings");
  }
  let originalImage = listing.image.url;
  let originalImageUrl = originalImage.replace(
    "/upload",
    "/upload/h_100,w_250/r_10/co_skyblue,e_outline/co_lightgray,e_shadow,x_5,y_8"
  );
  res.render("./listing/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
