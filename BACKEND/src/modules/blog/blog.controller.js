import BlogPost from "../../models/BlogPost.model.js";

class BlogController {
  // ─── Get All Blog Posts (Public & Admin) ──────────────────────────────────
  getAllPosts = async (req, res) => {
    try {
      const { category, tag, search, page = 1, limit = 10, all } = req.query;
      
      const query = {};

      // Regular users only see published posts. Admin can pass "all=true" to see drafts.
      if (!all || all !== "true") {
        query.isPublished = true;
      }

      if (category) {
        query.category = { $regex: new RegExp(`^${category}$`, "i") };
      }

      if (tag) {
        query.tags = { $in: [tag] };
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { excerpt: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await BlogPost.countDocuments(query);
      
      const posts = await BlogPost.find(query)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean();

      return res.status(200).json({
        success: true,
        posts,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Get Single Blog Post by Slug (Public) ────────────────────────────────
  getPostBySlug = async (req, res) => {
    try {
      const { slug } = req.params;
      const { all } = req.query;

      const query = { slug: slug.toLowerCase() };
      
      // Regular users only see published posts
      if (!all || all !== "true") {
        query.isPublished = true;
      }

      const post = await BlogPost.findOne(query).lean();
      
      if (!post) {
        return res.status(404).json({ success: false, message: "Blog post not found" });
      }

      return res.status(200).json({ success: true, post });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Create Blog Post (Admin Only) ─────────────────────────────────────────
  createPost = async (req, res) => {
    try {
      const {
        title,
        slug,
        content,
        excerpt,
        metaTitle,
        metaDescription,
        keywords,
        category,
        tags,
        author,
        readTime,
        isPublished,
      } = req.body;

      // Auto-generate slug if not provided
      const formattedSlug = (slug || title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Check duplicate slug
      const existing = await BlogPost.findOne({ slug: formattedSlug }).lean();
      if (existing) {
        return res.status(400).json({ success: false, message: "A blog post with this slug already exists." });
      }

      const newPost = new BlogPost({
        title,
        slug: formattedSlug,
        content,
        excerpt,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt,
        keywords,
        category,
        tags,
        author,
        readTime,
        isPublished,
      });

      await newPost.save();

      return res.status(201).json({ success: true, post: newPost });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Update Blog Post (Admin Only) ─────────────────────────────────────────
  updatePost = async (req, res) => {
    try {
      const { id } = req.params;
      const {
        title,
        slug,
        content,
        excerpt,
        metaTitle,
        metaDescription,
        keywords,
        category,
        tags,
        author,
        readTime,
        isPublished,
      } = req.body;

      const updateData = {
        title,
        content,
        excerpt,
        metaTitle,
        metaDescription,
        keywords,
        category,
        tags,
        author,
        readTime,
        isPublished,
      };

      if (slug) {
        const formattedSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        
        // Check duplicate slug
        const existing = await BlogPost.findOne({ slug: formattedSlug, _id: { $ne: id } }).lean();
        if (existing) {
          return res.status(400).json({ success: false, message: "Another blog post with this slug already exists." });
        }
        updateData.slug = formattedSlug;
      }

      const post = await BlogPost.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!post) {
        return res.status(404).json({ success: false, message: "Blog post not found" });
      }

      return res.status(200).json({ success: true, post });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  // ─── Delete Blog Post (Admin Only) ─────────────────────────────────────────
  deletePost = async (req, res) => {
    try {
      const { id } = req.params;
      const post = await BlogPost.findByIdAndDelete(id);

      if (!post) {
        return res.status(404).json({ success: false, message: "Blog post not found" });
      }

      return res.status(200).json({ success: true, message: "Blog post deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
}

export default new BlogController();
