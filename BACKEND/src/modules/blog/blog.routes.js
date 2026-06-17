import express from "express";
import verifyAdmin from "../../middleware/admin.middleware.js";
import BlogController from "./blog.controller.js";

const blogRouter = express.Router();

// ── Public Routes ────────────────────────────────────────────────────────────
blogRouter.get("/blogs", BlogController.getAllPosts);
blogRouter.get("/blogs/:slug", BlogController.getPostBySlug);

// ── Protected Admin Routes ───────────────────────────────────────────────────
blogRouter.post("/admin/blogs", verifyAdmin, BlogController.createPost);
blogRouter.put("/admin/blogs/:id", verifyAdmin, BlogController.updatePost);
blogRouter.delete("/admin/blogs/:id", verifyAdmin, BlogController.deletePost);

export default blogRouter;
