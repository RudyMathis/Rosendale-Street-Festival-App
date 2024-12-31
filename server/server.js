// import express from "express";
// import cors from "cors";
// import records from "./routes/record.js";
// import isAcceptedRouter from "./routes/isAcceptedRouter.js"; 

// const PORT = process.env.PORT || 5050;
// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use("/record", records);
// app.use("/record", isAcceptedRouter);

// // start the Express server
// app.listen(PORT, () => {
//   console.log(`Server listening on port ${PORT}`);
// });

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('server', { title: 'Express' });
});

module.exports = router;