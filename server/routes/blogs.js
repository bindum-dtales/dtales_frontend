const { Router } = require("express");
const { getSupabase } = require("../config/supabase");

const router = Router();

function generateSlug(title) {
  if (!title) return "untitled";
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function slugExists(supabase, slug, excludeId = null) {
  let query = supabase.from("blogs").select("id").eq("slug", slug);
  if (excludeId) {
    query = query.neq("id", excludeId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) && data.length > 0;
}

async function ensureUniqueSlug(supabase, baseSlug, excludeId = null) {
  const root = baseSlug || "untitled";
  let slug = root;
  let counter = 1;
  while (await slugExists(supabase, slug, excludeId)) {
    slug = `${root}-${counter}`;
    counter += 1;
  }
  return slug;
}

function stripHtml(html) {
  if (!html) return "";
  return String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function buildExcerpt(html, maxLen = 200) {
  const text = stripHtml(html);
  return text.length > maxLen ? text.slice(0, maxLen) : text;
}

function pickContentHtml(bodyContent) {
  if (typeof bodyContent === "string") return bodyContent;
  if (bodyContent && typeof bodyContent.html === "string") return bodyContent.html;
  return "";
}

function pickCoverImage(body) {
  return body.cover_image_url ?? body.cover_image ?? null;
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
    console.error(err);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

router.get("/public", async (_req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json((data || []).map(mapBlog));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch public blogs" });
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
    console.error(err);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});

router.post("/", async (req, res) => {
  try {
    const supabase = getSupabase();
    const title = (req.body.title || "").toString().trim();
    const contentHtml = pickContentHtml(req.body.content);
    const coverImage = pickCoverImage(req.body);
    const published = req.body.published === true;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!contentHtml) {
      return res.status(400).json({ error: "Content HTML is required" });
    }

    const uniqueSlug = await ensureUniqueSlug(supabase, generateSlug(title));
    const excerpt = buildExcerpt(contentHtml, 200);

    const { data, error } = await supabase
      .from("blogs")
      .insert([
        {
          title,
          slug: uniqueSlug,
          excerpt,
          content: contentHtml,
          cover_image: coverImage,
          published,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(mapBlog(data));
  } catch (err) {
    console.error(err);
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
    const contentHtmlRaw = pickContentHtml(req.body.content);
    const contentHtml = contentHtmlRaw !== "" ? contentHtmlRaw : current.content || "";
    const coverImage = pickCoverImage(req.body);
    const published = typeof req.body.published === "boolean" ? req.body.published : current.published === true;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    if (!contentHtml) {
      return res.status(400).json({ error: "Content HTML is required" });
    }

    const excerpt = buildExcerpt(contentHtml, 200);
    const slugToUse = current.slug || (await ensureUniqueSlug(supabase, generateSlug(title), req.params.id));

    const { data, error } = await supabase
      .from("blogs")
      .update({
        title,
        slug: slugToUse,
        excerpt,
        content: contentHtml,
        cover_image: coverImage ?? current.cover_image ?? null,
        published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;

    res.json(mapBlog(data));
  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

module.exports = router;

