const express = require("express");
const cors = require("cors");
const path = require("path");

const blogsRouter = require("./routes/blogs");
const caseStudiesRouter = require("./routes/case-studies");
const uploadsRouter = require("./routes/uploads");

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
}));

app.use(express.json());

// Serve uploaded images as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
