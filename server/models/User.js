const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 30,
  },
  email: {
    type: String,
    unique: 1,
    trim: true,
  },
  password: {
    type: String,
    minlength: 4,
  },
  role: {
    type: Number,
    default: 0,
  },
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  let user = this;
  console.log("user", user);

  // emal이랑 name 을 바꿀 때 말고 비번을 바꿀 때만 사용하기 위한 조건식
  if (user.isModified("password")) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  let user = this;
  console.log("USER", user);
  bcrypt.compare(plainPassword, user.password, function (err, isMatch) {
    console.log("plainPassword", plainPassword);
    console.log("user.password", user.password);
    console.log("isMatch", isMatch);
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  let user = this;

  // user._id : 데이터베이스에서 저장 된 id
  let token = jwt.sign(user._id.toHexString(), "secretToken");

  user.token = token;
  console.log("Token : ", token);
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  let user = this;

  // 토큰을 decode 하기
  jwt.verify(token, "secretToken", function (err, decoded) {
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

// userSchema.methods.comparePassword = function (plainPassword, cb) {
//   let user = this;
//   console.log(user);

//   bcrypt.compare(plainPassword, user.password, function (err, isMatch) {
//     console.log("plainPassword", plainPassword);
//     console.log("user.password", user.password);
//     console.log("isMatch", isMatch);
//     if (err) return cb(err);
//     cb(null, isMatch);
//   });
// };

const User = mongoose.model("User", userSchema);

module.exports = { User };
