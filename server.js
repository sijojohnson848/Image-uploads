require("dotenv").config()
const express = require("express");
const  mongoose = require("mongoose");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const PORT = 5000;
const app = express();
const fileUpload = require("./models/fileUpload")

//EJS template engine
app.set("view engine", "ejs");

//server the public
app.use(express.static("public"));


mongoose.connect(process.env.MONGODB_URI, {  }).then(()=>{
  console.log("DB connected ")
}).catch(e => console.log(e)
)



// configure cloudinary

cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//Configure milter storage cloudinary

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "images-folder",
    format: async (req, file) => "png",
    public_id: (req, file) => file.fieldname + "_" + Date.now(),
    transformation: [
      {
        width: 800,
        height: 600,
        crop: "fill",
      },
    ],
  },
});

//Configure Multer

const upload = multer({
  storage,
  limits: 1024 * 1020 * 5, //5MB limit
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload an image", false));
    }
  },
});

//Welcome route
app.get("/", (req, res) => {
  res.render("welcome");
});

// route for displaying upload form
app.get("/upload-form", (req, res) => {
  res.render("upload");
});

// Upload router

app.post("/upload", upload.single("file"), async (req, res) => {
  console.log(req.file);

  const uploaded = await fileUpload.create({
    url: req.file.path,
    public_id: req.file.fieldname
  })

    res.redirect("/images");

  // res.json({ message: "file Upload", uploaded });
});


// get all image

app.get("/images", async (req, res) => {
  try {
    const files = await fileUpload.find();
    console.log(files); // Debugging step
    res.render("images", { files });
  } catch (error) {
    res.json(error);
  }
});


app.listen(PORT, console.log(`Sever is running on ${PORT}`));