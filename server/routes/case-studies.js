const { Router } = require("express");
const slugify = require("slugify");
const { getSupabase } = require("../config/supabase");

const router = Router();

function generateSlug(title) {
  return slugify(String(title || "case-study"), {
    lower: true,
    strict: true,
    trim: true,
  });
}

async function slugExists(supabase, slug, excludeId = null) {
  let query = supabase.from("case_studies").select("id").eq("slug", slug);
  if (excludeId) {
    query = query.neq("id", excludeId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return Array.isArray(data) && data.length > 0;
}

async function ensureUniqueSlug(supabase, baseSlug, excludeId = null) {
  const root = baseSlug || "case-study";
  let slug = root;
  let counter = 1;
  while (await slugExists(supabase, slug, excludeId)) {
    slug = `${root}-${counter}`;
    counter += 1;
  }
  return slug;
}

function extractContent(bodyContent) {
  if (typeof bodyContent === "string") return bodyContent;
  if (bodyContent && typeof bodyContent.html === "string") return bodyContent.html;
  return "";
}

router.get("/", async (_req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch case studies" });
  }
});

router.get("/public", async (_req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch public case studies" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("case_studies")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (!data) {
      return res.status(404).json({ error: "Case study not found" });
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch case study" });
  }
});

router.post("/", async (req, res) => {
  try {
    const supabase = getSupabase();
    const title = (req.body.title || "").toString().trim();
    const content = extractContent(req.body.content);
    const cover_image_url = req.body.cover_image_url ?? null;
    const published = req.body.published === true;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const slug = await ensureUniqueSlug(supabase, generateSlug(title));

    const { data, error } = await supabase
      .from("case_studies")
      .insert([
        {
          title,
          slug,
          content,
          cover_image_url,
          published,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create case study" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const supabase = getSupabase();

    const { data: current, error: fetchError } = await supabase
      .from("case_studies")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (!current) {
      return res.status(404).json({ error: "Case study not found" });
    }

    const title = ((req.body.title ?? current.title) || "").toString().trim();
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const content = req.body.content !== undefined
      ? extractContent(req.body.content)
      : current.content ?? "";

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const cover_image_url = req.body.cover_image_url !== undefined
      ? req.body.cover_image_url
      : current.cover_image_url ?? null;

    const published = typeof req.body.published === "boolean"
      ? req.body.published
      : current.published === true;

    const slug = await ensureUniqueSlug(supabase, generateSlug(title), req.params.id);

    const { data, error } = await supabase
      .from("case_studies")
      .update({
        title,
        slug,
        content,
        cover_image_url,
        published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) throw error;

    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to update case study" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("case_studies")
      .delete()
      .eq("id", req.params.id)
      .select("id");

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Case study not found" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete case study" });
  }
});

module.exports = router;
