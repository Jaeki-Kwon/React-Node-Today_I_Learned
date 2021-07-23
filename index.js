const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

require("./routes")(app);

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./server/config/key");

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("✅  MongoDB Connected!!!"))
  .catch((err) => console.log(err));

app.use(cors());

app.get("/", (req, res) => res.send("잘되는건가??"));
app.get("/api/hello", (req, res) => res.send("되는거니??"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/users", require("./server/routes/users"));
app.use("/api/board", require("./server/routes/board"));

if (
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "staging"
) {
  // Add production middleware such as redirecting to https

  // Express will serve up production assets i.e. main.js
  app.use(express.static(__dirname + "/client/build"));
  // If Express doesn't recognize route serve index.html
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

const handleListening = () =>
  console.log(`✅  Listening on: http://localhost:${PORT}`);

app.listen(PORT, handleListening);
