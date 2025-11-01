import express from "express";
import cors from "cors";
import uploadProjectRouter from "@/routes/upload-project";
import updateProjectRouter from "@/routes/update-project";
import onboardingRouter from "@/routes/onboarding";
import testRateLimitRouter from "@/routes/test-rate-limit";
import submitChallengeEntryRouter from "@/routes/submit-challenge-entry";

const app = express();

// Trust proxy for accurate IP addresses (important for rate limiting)
// Set to true if behind a proxy/load balancer (e.g., on Railway, Heroku, etc.)
app.set("trust proxy", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/upload-project", uploadProjectRouter);
app.use("/update-project", updateProjectRouter);
app.use("/onboarding", onboardingRouter);
app.use("/test-rate-limit", testRateLimitRouter);
app.use("/submit-challenge-entry", submitChallengeEntryRouter);

app.get("/", (req, res) => {
  console.log("Root request received");

  res
    .status(200)
    .json({ message: "Hello World", timestamp: new Date().toISOString() });
});

app.get("/test", (req, res) => {
  console.log("Test request received");

  res.status(200).json({ message: "Test" });
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
