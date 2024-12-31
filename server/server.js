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

// import express from "express";
// import cors from "cors";
// import records from "./routes/record.js";
// import isAcceptedRouter from "./routes/isAcceptedRouter.js";

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use("/record", records);
// app.use("/record", isAcceptedRouter);

// // Export the app for Vercel
// export default app;
import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import isAcceptedRouter from "./routes/isAcceptedRouter.js"; 

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Prefix all API routes with /api
app.use("/api/record", records);
app.use("/api/record", isAcceptedRouter);

// Handle other requests (frontend) by serving static files
// If you have any static files to serve, ensure this middleware comes after your API routes
app.use(express.static("client/dist"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
