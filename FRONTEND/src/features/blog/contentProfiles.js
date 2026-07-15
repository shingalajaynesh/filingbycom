export const blogAuthorProfiles = {
  "filingby-editorial-desk": {
    name: "FilingBy Editorial Desk",
    bio: "Business compliance editors covering registrations, tax and regulatory workflows for Indian startups and MSMEs."
  }
};

export const blogReviewerProfiles = {
  "filingby-content-team": {
    name: "FilingBy Content Team",
    prefix: "Editorially reviewed by",
    title: "Editorial review",
    experience: "",
    schemaType: "Organization"
  }
};

export function resolveAuthorProfile(post) {
  if (post?.authorId && blogAuthorProfiles[post.authorId]) {
    return blogAuthorProfiles[post.authorId];
  }

  return {
    name: post?.author || "FilingBy Editorial Desk",
    bio: "Business compliance editors covering registrations, tax and regulatory workflows for Indian startups and MSMEs."
  };
}

export function resolveReviewerProfile(post) {
  if (post?.reviewerId && blogReviewerProfiles[post.reviewerId]) {
    return blogReviewerProfiles[post.reviewerId];
  }

  return {
    name: "FilingBy Content Team",
    prefix: "Editorially reviewed by",
    title: "Editorial review",
    experience: "",
    schemaType: "Organization"
  };
}
