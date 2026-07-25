import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { isValidImageUrl, optimizeCloudinaryUrl } from "../../shared/utils/cloudinary";

const API_BASE = (
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_BACKEND_URL || 
  "http://localhost:3000"
).replace(/\/$/, "");

export default function AdminBlogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "GST",
    readTime: 5,
    excerpt: "",
    content: "",
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    tags: "",
    author: "FilingBy Compliance Desk",
    isPublished: false,
    image: ""
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const uploaderData = new FormData();
    uploaderData.append("image", file);

    try {
      const res = await axios.post(
        `${API_BASE}/admin/blogs/upload-image`, 
        uploaderData, 
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true
        }
      );
      if (res.data.success) {
        setFormData(prev => ({ ...prev, image: res.data.url }));
        toast.success("Image uploaded successfully");
      } else {
        toast.error(res.data.message || "Failed to upload image");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error uploading image");
    } finally {
      setIsUploading(false);
    }
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/blogs?all=true`, { withCredentials: true });
      if (res.data.success) {
        setPosts(res.data.posts || []);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormData({
      title: "",
      slug: "",
      category: "GST",
      readTime: 5,
      excerpt: "",
      content: "",
      metaTitle: "",
      metaDescription: "",
      keywords: "",
      tags: "",
      author: "FilingBy Compliance Desk",
      isPublished: false,
      image: ""
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title || "",
      slug: post.slug || "",
      category: post.category || "GST",
      readTime: post.readTime || 5,
      excerpt: post.excerpt || "",
      content: post.content || "",
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      keywords: post.keywords || "",
      tags: post.tags ? post.tags.join(", ") : "",
      author: post.author || "FilingBy Compliance Desk",
      isPublished: post.isPublished || false,
      image: post.image || ""
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await axios.delete(`${API_BASE}/admin/blogs/${id}`, { withCredentials: true });
      if (res.data.success) {
        toast.success("Blog post deleted successfully");
        fetchPosts();
      } else {
        toast.error(res.data.message || "Failed to delete post");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error deleting post");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Process tags
    const tagsArray = formData.tags
      ? formData.tags.split(",").map(t => t.trim()).filter(Boolean)
      : [];

    const payload = {
      ...formData,
      tags: tagsArray,
      readTime: Number(formData.readTime)
    };

    try {
      if (editingPost) {
        // Update
        const res = await axios.put(
          `${API_BASE}/admin/blogs/${editingPost._id}`, 
          payload, 
          { withCredentials: true }
        );
        if (res.data.success) {
          toast.success("Blog post updated successfully");
          setIsModalOpen(false);
          fetchPosts();
        } else {
          toast.error(res.data.message || "Failed to update blog post");
        }
      } else {
        // Create
        const res = await axios.post(
          `${API_BASE}/admin/blogs`, 
          payload, 
          { withCredentials: true }
        );
        if (res.data.success) {
          toast.success("Blog post created successfully");
          setIsModalOpen(false);
          fetchPosts();
        } else {
          toast.error(res.data.message || "Failed to create blog post");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error saving blog post");
    }
  };

  const handleInputChange = (key, val) => {
    setFormData(prev => {
      const updated = { ...prev, [key]: val };
      // Auto-generate slug from title if creating and slug isn't customized
      if (key === "title" && !editingPost && !prev.slug) {
        updated.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      }
      return updated;
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-200 rounded-2xl shadow-sm gap-4 min-h-[300px]">
        <div className="w-8 h-8 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" />
        <p className="text-gray-500 text-sm font-medium">Loading blogs...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      {/* Title Header */}
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Manage Knowledge Base / Blogs</h2>
          <p className="text-xs text-gray-500 mt-1">
            Write, update, publish, and delete articles to establish topical SEO authority.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-[#1A56DB] text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition"
        >
          + Add New Article
        </button>
      </div>

      {/* Blogs List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-555 uppercase tracking-wider">Title & Excerpt</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-555 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-555 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-555 uppercase tracking-wider">Publish Date</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-555 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                  No blog posts found. Click "+ Add New Article" to get started.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 max-w-md">
                    <div className="flex items-center gap-3">
                      {isValidImageUrl(post.image) ? (
                        <img
                          src={optimizeCloudinaryUrl(post.image)}
                          alt={post.title}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-100 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 text-gray-300">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900 line-clamp-1">{post.title}</p>
                        <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{post.excerpt}</p>
                        <p className="text-[10px] text-gray-300 font-semibold tracking-wide uppercase mt-1">/blog/{post.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-blue-50 text-[#1A56DB] px-2.5 py-0.5 text-xs font-bold">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      post.isPublished 
                        ? "bg-green-50 text-green-700" 
                        : "bg-yellow-50 text-yellow-700"
                    }`}>
                      {post.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500">
                    {post.publishedAt 
                      ? new Date(post.publishedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) 
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(post)}
                      className="px-3 py-1.5 border border-gray-300 hover:border-blue-600 hover:text-blue-600 text-xs font-semibold rounded-lg transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold rounded-lg transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/Create Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/55 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] shadow-2xl flex flex-col overflow-hidden animate-fadeInUp">
            <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-base font-bold text-gray-900">
                {editingPost ? "Edit Article" : "Create New Article"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-900 font-bold text-xl cursor-pointer px-2"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Title */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-750 uppercase">Article Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                    required
                  />
                </div>

                {/* Slug */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-750 uppercase">Slug Path</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange("slug", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                    placeholder="auto-generated-from-title"
                    required
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-750 uppercase">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                  >
                    <option value="GST">GST</option>
                    <option value="Company Registration">Company Registration</option>
                    <option value="Virtual Office">Virtual Office</option>
                    <option value="General">General</option>
                  </select>
                </div>

                {/* Read Time */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-750 uppercase">Read Time (minutes)</label>
                  <input
                    type="number"
                    value={formData.readTime}
                    onChange={(e) => handleInputChange("readTime", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                    min="1"
                    required
                  />
                </div>

                {/* Author */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-750 uppercase">Author Name</label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => handleInputChange("author", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                    required
                  />
                </div>

                {/* Tags */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-gray-750 uppercase">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm"
                    placeholder="e.g. GST, Tax, E-commerce"
                  />
                </div>

                {/* Cover Image Upload */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-xs font-bold text-gray-750 uppercase">Cover Image</label>
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="relative w-full sm:w-48 h-28 border border-dashed border-gray-350 rounded-xl overflow-hidden flex items-center justify-center bg-gray-50 group">
                      {isValidImageUrl(formData.image) ? (
                        <>
                          <img
                            src={optimizeCloudinaryUrl(formData.image)}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleInputChange("image", "")}
                            className="absolute top-1.5 right-1.5 p-1 bg-red-650 text-white rounded-full hover:bg-red-750 transition shadow"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400 p-2">
                          <svg className="w-8 h-8 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-[10px]">No image uploaded</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer px-4 py-2 bg-white border border-gray-350 rounded-lg text-xs font-semibold hover:bg-gray-50 transition shadow-sm inline-flex items-center gap-1.5">
                          {isUploading ? (
                            <>
                              <div className="w-3.5 h-3.5 rounded-full border-2 border-[#1A56DB] border-t-transparent animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              <span>Upload Cover Image</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={isUploading}
                          />
                        </label>
                        {formData.image && (
                          <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Ready
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Supports PNG, JPG, GIF up to 5MB. Uploading is secure and optimized automatically.
                      </p>
                      {formData.image && (
                        <div className="text-xs">
                          <span className="text-gray-400 text-[10px]">URL: </span>
                          <span className="text-gray-600 text-[10px] font-mono break-all">{formData.image}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-750 uppercase">Excerpt Summary</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange("excerpt", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm resize-none"
                  rows="2"
                  required
                />
              </div>

              {/* Rich Content HTML */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-750 uppercase">Article Body Content (HTML / Rich Text)</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm font-mono"
                  rows="8"
                  placeholder="e.g. <h2>Subheading</h2> <p>Text goes here...</p>"
                  required
                />
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-3">SEO METADATA (OPTIONAL)</h4>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700">Meta Title</label>
                    <input
                      type="text"
                      value={formData.metaTitle}
                      onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none text-sm"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-gray-700">Keywords</label>
                    <input
                      type="text"
                      value={formData.keywords}
                      onChange={(e) => handleInputChange("keywords", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none text-sm"
                      placeholder="e.g. gst registration, tax advice"
                    />
                  </div>
                </div>

                <div className="space-y-1 mt-3">
                  <label className="block text-xs font-bold text-gray-700">Meta Description</label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none text-sm resize-none"
                    rows="2"
                  />
                </div>
              </div>

              {/* Publish Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => handleInputChange("isPublished", e.target.checked)}
                  className="w-4 h-4 text-[#1A56DB] rounded border-gray-300 focus:ring-[#1A56DB] cursor-pointer"
                />
                <label htmlFor="isPublished" className="text-sm font-bold text-gray-800 cursor-pointer select-none">
                  Publish Article immediately (Visible in the blog directory)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-5 flex items-center justify-end gap-3 sticky bottom-0 bg-white pb-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-350 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1A56DB] text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer"
                >
                  {editingPost ? "Save Changes" : "Create Article"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
