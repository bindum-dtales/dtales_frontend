const express = require("express");
const cors = require("cors");

const blogsRouter = require("./routes/blogs");
const caseStudiesRouter = require("./routes/case-studies");

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

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
