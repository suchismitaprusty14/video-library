let mongoclient = require("mongodb").MongoClient;
let express = require("express");
let cors = require("cors");

let conString = "mongodb://127.0.0.1:27017";

let app = express();
app.use(cors());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.get("/getvideos", function (req, res) {
  mongoclient.connect(conString).then((response) => {
    let database = response.db("video-library");
    database
      .collection("tblVideos")
      .find({})
      .toArray()
      .then((documents) => {
        res.send(documents);
        res.end();
      });
  });
});
app.get("/getusers", function (req, res) {
  mongoclient.connect(conString).then((response) => {
    let database = response.db("video-library");
    database
      .collection("tblUsers")
      .find({})
      .toArray()
      .then((documents) => {
        res.send(documents);
        res.end();
      });
  });
});
app.get("/getadmin", function (req, res) {
  mongoclient.connect(conString).then((response) => {
    let database = response.db("video-library");
    database
      .collection("tblAdmin")
      .find({})
      .toArray()
      .then((documents) => {
        res.send(documents);
        res.end();
      });
  });
});
app.get("/getcategories", (req, res) => {
  mongoclient.connect(conString).then((response) => {
    let database = response.db("video-library");
    database
      .collection("tblCategories")
      .find({})
      .toArray()
      .then((documents) => {
        res.send(documents);
        res.end();
      });
  });
});

app.post("/addvideo", function (req, res) {
  let video = {
    VideoId: req.body.VideoId,
    Title: req.body.Title,
    Url: req.body.Url,
    Views: parseInt(req.body.Views),
    Likes: parseInt(req.body.Likes),
    CategoryId: parseInt(req.body.CategoryId),
  };
  mongoclient.connect(conString).then((response) => {
    let database = response.db("video-library");
    database
      .collection("tblVideos")
      .insertOne(video)
      .then(() => {
        console.log("video inserted succesfully");
        res.redirect("/getvideos");
      });
  });
});
app.post("/adduser", (req, res) => {
  let user = {
    UserId: req.body.UserId,
    UserName: req.body.UserName,
    Password: req.body.Password,
    Email: req.body.Email,
    Mobile: req.body.Mobile,
  };
  mongoclient.connect(conString).then((response) => {
    let database = response.db("video-library");
    database
      .collection("tblUsers")
      .insertOne(user)
      .then(() => {
        console.log("user registered succesfully");
      });
  });
});
app.put("/updateVideo/:id", function (req, res) {
  let id = req.params.id;
  let updateValue = {};
  if (req.body.Title) updateValue.Title = req.body.Title;
  if (req.body.Url) updateValue.Url = req.body.Url;
  if (req.body.Views) updateValue.Views = parseInt(req.body.Views);
  if (req.body.Likes) updateValue.Likes = parseInt(req.body.Likes);
  if (req.body.Category) updateValue.Category = req.body.Category;

  mongoclient.connect(conString).then((response) => {
    let database = response.db("video-library");
    database
      .collection("tblVideos")
      .updateOne({ VideoId: id }, { $set: updateValue })
      .then((result) => {
        res.redirect(`/videos/${id}`);
      });
  });
});

app.delete("/deleteVideo/:id", (req, res) => {
  let id = req.params.id;
  mongoclient.connect(conString).then((response) => {
    let database = response.db("video-library");
    database
      .collection("tblVideos")
      .deleteOne({ VideoId: id })
      .then((result) => {
        console.log("video-deleted");
      });
  });
});

app.listen(4400);
console.log(`server started : http://127.0.0.1:4400`);
