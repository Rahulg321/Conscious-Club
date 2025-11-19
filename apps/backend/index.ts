import express from "express";
import cors from "cors";
import uploadProjectRouter from "@/routes/upload-project";
import uploadMashupProjectRouter from "@/routes/upload-mashup-project";
import updateProjectRouter from "@/routes/update-project";
import onboardingRouter from "@/routes/onboarding";
import testRateLimitRouter from "@/routes/test-rate-limit";
import submitChallengeEntryRouter from "@/routes/submit-challenge-entry";

// Validate required environment variables on startup
const requiredEnvVars = [
  "AUTH_SECRET",
  "GCLOUD_PROJECT_ID",
  "GCLOUD_BUCKET",
  "GCS_CLIENT_EMAIL",
  "GCS_PRIVATE_KEY",
];

const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingEnvVars.length > 0) {
  console.error("❌ [STARTUP] Missing required environment variables:");
  missingEnvVars.forEach((varName) => {
    console.error(`   - ${varName}`);
  });
  console.error("\nPlease set these environment variables before starting the server.");
  process.exit(1);
}

console.log("✅ [STARTUP] All required environment variables are set");

const app = express();

// Trust proxy for accurate IP addresses (important for rate limiting)
// Set to true if behind a proxy/load balancer (e.g., on Railway, Heroku, etc.)
app.set("trust proxy", true);

// Configure body size limits for file uploads (matching Multer's 200MB limit)
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));

// Configure CORS with allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use("/upload-project", uploadProjectRouter);
app.use("/upload-mashup-project", uploadMashupProjectRouter);
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
