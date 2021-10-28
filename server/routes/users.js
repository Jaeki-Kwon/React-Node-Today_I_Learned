const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");

router.post("/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    // console.log("유저", user);
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "등록되지 않은 사용자입니다. 이메일을 확인해주세요.",
      });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });

      user.generateToken((err, user) => {
        console.log("User : ", user);

        if (err) return res.status(400).send(err);

        // 토큰 쿠키에 저장하기
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, isMatch: true, user });
      });
    });
  });
});

router.get("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
  });
});

router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

// router.post("/login", (req, res) => {
//   User.findOne({ email: req.body.email }, (err, user) => {
//     console.log("user", user);
//     if (!user) {
//       return res.json({
//         loginSuccess: false,
//         message: "등록되지 않은 사용자입니다. 이메일을 확인해주세요.",
//       });
//     }

//     user.comparePassword(req.boy.password, (err, isMatch) => {
//       console.log("isMatch", isMatch);
//       if (!isMatch)
//         return res.json({
//           loginSuccess: false,
//           message: "비밀번호가 틀렸습니다.",
//         });
//     });
//   });
// });

module.exports = router;
