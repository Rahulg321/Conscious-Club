import express from "express";
import cors from "cors";
import uploadProjectRouter from "@/routes/upload-project";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/upload-project", uploadProjectRouter);

app.get("/", (req, res) => {
  console.log("Root request received");

  res
    .status(200)
    .json({ message: "Hello World", timestamp: new Date().toISOString() });
});

app.get("/health", (req, res) => {
  console.log("Health check request received");

  res.status(200).json({ message: "OK" });
});

const port = parseInt(process.env.PORT || "8080");

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
  console.log(`PORT env var: ${process.env.PORT}`);
});
