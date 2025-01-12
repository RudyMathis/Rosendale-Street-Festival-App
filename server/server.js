import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import isAcceptedRouter from "./routes/isAcceptedRouter.js";
import labelsRouter from "./routes/labels.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);
app.use("/record", isAcceptedRouter);
app.use("/labels", labelsRouter);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});