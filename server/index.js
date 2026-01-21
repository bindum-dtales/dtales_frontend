const express = require("express");
const cors = require("cors");

const requiredEnv = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_BUCKET",
];

const missingVars = requiredEnv.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  console.error("❌ STARTUP FAILED - Missing required environment variables:");
  missingVars.forEach((key) => {
    console.error(`   - ${key}`);
  });
  console.error("\nSet these variables in your .env file and try again.");
  process.exit(1);
}

console.log("✅ Environment variables validated");
const blogsRouter = require("./routes/blogs");
const caseStudiesRouter = require("./routes/case-studies");
const uploadsRouter = require("./routes/uploads");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
}));

app.use(express.json());

app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});

app.use("/api/blogs", blogsRouter);
app.use("/api/case-studies", caseStudiesRouter);
app.use("/api/uploads", uploadsRouter);

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
