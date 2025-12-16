const express = require("express");
const cors = require("cors");

const blogsRouter = require("./routes/blogs");
const caseStudiesRouter = require("./routes/case-studies");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/blogs", blogsRouter);
app.use("/api/case-studies", caseStudiesRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
