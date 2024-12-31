import express from "express";

const router = express.Router();

/* GET home page. */
router.get("/", (req, res) => {
  res.render("server", { title: "Express" });
});

export default router;
