const express = require("express");
const router = express.Router();
const { Board } = require("../models/Board");

router.post("/write", (req, res) => {
  const board = new Board(req.body);

  board.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true, doc });
  });
});

router.get("/getBoardList", async (req, res) => {
  // try {
  //   const _id = req.body._id;
  //   const board = await Board.find({ writer: _id }, null, {
  //     sort: { createdAt: -1 },
  //   });
  //   res.json({ success: true, list: board });
  // } catch (err) {
  //   console.log(err);
  //   res.json({ success: false });
  // }
  Board.find()
    .populate("writer")
    .exec((err, board) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, board });
    });
});

router.post("/getBoardDetail", (req, res) => {
  // console.log(req.body.boardId);
  Board.findOne({ _id: req.body.boardId })
    .populate("writer")
    .exec((err, boardDetail) => {
      if (err) return res.status(400).send(err);
      res.status(200).json({ success: true, boardDetail });
    });
});

router.post("/deleteBoard", (req, res) => {
  console.log(req.body);
  console.log(req.body._id);
  Board.findOneAndDelete({
    boardId: req.body.boardId,
  }).exec((err, result) => {
    if (err) return res.status(400).send(err);
    return res.status(200).json({ success: true });
  });
});

router.post("/updateBoard", (req, res) => {
  const {
    body: { boardId, title, content },
  } = req;
  console.log("title", title);
  console.log("content", content);
  Board.findOneAndUpdate({ _id: boardId }, { title, content }).exec(
    (err, user) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, user });
    }
  );
});

module.exports = router;
