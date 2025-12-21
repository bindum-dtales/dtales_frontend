const express = require("express");
const cors = require("cors");
const path = require("path");

// ============================================================================
// FAIL-FAST: Validate all required environment variables at startup
// ============================================================================
const requiredEnv = [
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "SUPABASE_BUCKET",
  "DATABASE_URL",
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

// Initialize Supabase once (will throw if misconfigured)
const supabase = require("./config/supabase");

// Verify bucket exists
(async () => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) throw error;
    const bucketExists = buckets.some(b => b.name === process.env.SUPABASE_BUCKET);
    if (!bucketExists) {
      throw new Error(`Bucket '${process.env.SUPABASE_BUCKET}' does not exist in Supabase Storage`);
    }
    console.log(`✅ Supabase bucket '${process.env.SUPABASE_BUCKET}' verified`);
  } catch (err) {
    console.error("❌ STARTUP FAILED - Supabase bucket verification:", err.message);
    process.exit(1);
  }
})();

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
