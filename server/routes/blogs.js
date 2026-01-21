const { Router } = require("express");
const { getSupabase } = require("../config/supabase");

const router = Router();

function stripHtml(html) {
  if (!html) return "";
  return String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function buildExcerpt(html, maxLen = 200) {
  const text = stripHtml(html);
  return text.length > maxLen ? text.slice(0, maxLen) : text;
}

function extractContent(bodyContent) {
  if (typeof bodyContent === "string") return bodyContent;
  if (bodyContent && typeof bodyContent.html === "string") return bodyContent.html;
  return "";
}

function mapBlog(row) {
  return {
    ...row,
    cover_image_url: row?.cover_image ?? row?.cover_image_url ?? null,
  };
}

router.get("/", async (_req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json((data || []).map(mapBlog));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.json(mapBlog(data));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});

router.post("/", async (req, res) => {
  try {
    const supabase = getSupabase();
    const title = (req.body.title || "").toString().trim();
    const content = extractContent(req.body.content);
    const cover_image = req.body.cover_image ?? null;
    const published = req.body.published === true;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const excerpt = buildExcerpt(content, 200);

    const { data, error } = await supabase
      .from("blogs")
      .insert([
        {
          title,
          excerpt,
          content,
          cover_image,
          published,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(mapBlog(data));
  } catch (err) {
    res.status(500).json({ error: "Failed to create blog" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const supabase = getSupabase();

    const { data: current, error: fetchError } = await supabase
      .from("blogs")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (!current) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const title = ((req.body.title ?? current.title) || "").toString().trim();
    const contentRaw = extractContent(req.body.content);
    const content = contentRaw !== "" ? contentRaw : current.content || "";
    const cover_image = req.body.cover_image !== undefined ? req.body.cover_image : current.cover_image ?? null;
    const published = typeof req.body.published === "boolean" ? req.body.published : current.published === true;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const excerpt = buildExcerpt(content, 200);

    const { data, error } = await supabase
      .from("blogs")
      .update({
        title,
        excerpt,
        content,
        cover_image,
        published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(mapBlog(data));
  } catch (err) {
    res.status(500).json({ error: "Failed to update blog" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("blogs")
      .delete()
      .eq("id", req.params.id)
      .select("id");

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

module.exports = router;

