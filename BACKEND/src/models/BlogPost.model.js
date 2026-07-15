import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: false,
    },
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    keywords: {
      type: String, // Comma separated keywords
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: "General",
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: String,
      required: true,
      default: "FilingBy Compliance Desk",
    },
    authorId: {
      type: String,
      trim: true,
    },
    readTime: {
      type: Number,
      required: true,
      default: 5, // Estimated read time in minutes
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    lastUpdated: {
      type: Date,
    },
    lastVerifiedAt: {
      type: Date,
    },
    // New E-E-A-T and relational fields for Phase 3/4 content engine
    reviewedBy: {
      type: String,
      trim: true,
    },
    reviewerId: {
      type: String,
      trim: true,
    },
    reviewedByTitle: {
      type: String,
      trim: true,
    },
    reviewerExperience: {
      type: String,
      trim: true,
    },
    searchIntent: {
      type: String,
      trim: true,
    },
    seoTitle: {
      type: String,
      trim: true,
    },
    seoDescription: {
      type: String,
      trim: true,
    },
    focusKeyword: {
      type: String,
      trim: true,
    },
    secondaryKeywords: {
      type: [String],
      default: [],
    },
    subCategory: {
      type: String,
      trim: true,
    },
    readingTime: {
      type: String,
      trim: true,
    },
    featuredImage: {
      type: String,
      trim: true,
    },
    imageAlt: {
      type: String,
      trim: true,
    },
    featuredImageWidth: {
      type: Number,
    },
    featuredImageHeight: {
      type: Number,
    },
    tableOfContents: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    keyTakeaways: {
      type: [String],
      default: [],
    },
    faq: [
      {
        q: { type: String, trim: true },
        a: { type: String, trim: true }
      }
    ],
    schemaData: {
      type: mongoose.Schema.Types.Mixed,
    },
    relatedServices: {
      type: [String],
      default: [],
    },
    relatedBlogs: {
      type: [String],
      default: [],
    },
    topicHub: {
      type: String,
      trim: true,
    },
    relatedCalculators: {
      type: [String],
      default: [],
    },
    relatedTemplates: {
      type: [String],
      default: [],
    },
    internalLinks: {
      type: [String],
      default: [],
    },
    cta: {
      type: String,
      trim: true,
    },
    imageGallery: [
      {
        url: { type: String, trim: true },
        alt: { type: String, trim: true },
        caption: { type: String, trim: true },
        width: { type: Number },
        height: { type: Number }
      }
    ],
    references: [
      {
        title: { type: String, trim: true },
        url: { type: String, trim: true },
        publisher: { type: String, trim: true },
        accessedOn: { type: String, trim: true }
      }
    ],
    sources: [
      {
        title: { type: String, trim: true },
        organisation: { type: String, trim: true },
        url: { type: String, trim: true },
        accessedOn: { type: String, trim: true },
        kind: { type: String, trim: true }
      }
    ],
    versionHistory: [
      {
        date: { type: String, trim: true },
        change: { type: String, trim: true }
      }
    ],
    status: {
      type: String,
      trim: true,
      default: "published",
    }
  },
  { timestamps: true }
);

// Middleware to automatically set publishedAt date when isPublished is true
blogPostSchema.pre("save", function (next) {
  if (this.isModified("isPublished") && this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  if (!this.lastUpdated) {
    this.lastUpdated = this.updatedAt || new Date();
  }
  next();
});

const BlogPost = mongoose.model("BlogPost", blogPostSchema);
export default BlogPost;
