import express from "express";
import multer from "multer";
import verifyAdmin from "../../middleware/admin.middleware.js";
import BlogController from "./blog.controller.js";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});
const blogRouter = express.Router();

// ── Public Routes ────────────────────────────────────────────────────────────
blogRouter.get("/blogs", BlogController.getAllPosts);
blogRouter.get("/blogs/:slug", BlogController.getPostBySlug);

// ── Protected Admin Routes ───────────────────────────────────────────────────
blogRouter.post("/admin/blogs", verifyAdmin, BlogController.createPost);
blogRouter.put("/admin/blogs/:id", verifyAdmin, BlogController.updatePost);
blogRouter.delete("/admin/blogs/:id", verifyAdmin, BlogController.deletePost);
blogRouter.post("/admin/blogs/upload-image", verifyAdmin, upload.single("image"), BlogController.uploadImage);

export default blogRouter;
