export const blogAuthorProfiles = {
  "filingby-editorial-team": {
    name: "FilingBy Editorial Team",
    bio: "Business compliance editors covering registrations, tax and regulatory workflows for Indian startups and MSMEs."
  },
  "filingby-editorial-desk": {
    name: "FilingBy Editorial Team",
    bio: "Business compliance editors covering registrations, tax and regulatory workflows for Indian startups and MSMEs."
  }
};

export function resolveAuthorProfile(post) {
  if (post?.authorId && blogAuthorProfiles[post.authorId]) {
    return blogAuthorProfiles[post.authorId];
  }

  return {
    name: post?.author || "FilingBy Editorial Team",
    bio: "Business compliance editors covering registrations, tax and regulatory workflows for Indian startups and MSMEs."
  };
}

