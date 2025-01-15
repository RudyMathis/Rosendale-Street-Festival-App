import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import isAcceptedRouter from "./routes/isAcceptedRouter.js";
import labelsRouter from "./routes/labels.js";
import members from "./routes/members.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);
app.use("/record", isAcceptedRouter);
app.use("/labels", labelsRouter);
app.use("/members", members);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});