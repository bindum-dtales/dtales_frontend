import "dotenv/config";
import express from "express";
import cors from "cors";

import blogsRouter from "./routes/blogs.js";
import caseStudiesRouter from "./routes/case-studies.js";
import uploadsRouter from "./routes/uploads.js";

const app = express();

app.use(cors());
app.use("/api/uploads", uploadsRouter);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/blogs", blogsRouter);
app.use("/api/case-studies", caseStudiesRouter); // ✅ THIS FIXES IT

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Backend running on port", PORT);
});
