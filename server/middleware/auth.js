const { User } = require("../models/User");

let auth = (req, res, next) => {
  // 인증처리 하는 곳
  // 1. 클라이언트 쿠키에서 토큰 갖고오기
  let token = req.cookies.x_auth;
  // 2. 토큰을 복호화 -> 유저 찾기
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    console.log("User ~~~~~~ : ", user);

    req.token = token;
    req.user = user;

    // console.log("req.user : ", req.user);
    // console.log("User : ", user);
    next();
  });
};

module.exports = { auth };
