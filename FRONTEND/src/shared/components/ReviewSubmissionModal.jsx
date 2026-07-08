import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:3000"
).replace(/\/$/, "");

const createInitialFormState = () => ({
  authorName: "",
  businessName: "",
  rating: 5,
  comment: "",
});

export default function ReviewSubmissionModal({
  open,
  onClose,
  pageType = "home",
  portal = "ca-portal",
  serviceSlug,
  virtualLocationSlug,
  officeCenter,
  title = "Leave a review",
  description = "Your review will be sent for approval before it appears on the site.",
}) {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(createInitialFormState());

  useEffect(() => {
    if (open) {
      setFormData(createInitialFormState());
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.authorName.trim()) {
      toast.error("Please add your name");
      return;
    }

    if (!formData.comment.trim()) {
      toast.error("Please add your review comment");
      return;
    }

    const payload = {
      ...formData,
      portal,
      pageType,
    };

    if (pageType === "service" && serviceSlug) {
      payload.serviceSlug = serviceSlug;
    }

    if (pageType === "location" && virtualLocationSlug) {
      payload.virtualLocationSlug = virtualLocationSlug;
      if (officeCenter) {
        payload.officeCenter = officeCenter;
      }
    }

    setSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE}/reviews`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data?.success) {
        toast.success(res.data.message || "Review submitted successfully");
        onClose?.();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#1A56DB]">Share your experience</p>
            <h3 className="mt-1 text-xl font-bold text-gray-900">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Close review form"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Your Name *</label>
              <input
                type="text"
                name="authorName"
                value={formData.authorName}
                onChange={handleChange}
                placeholder="Rajesh Kumar"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1A56DB]"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Company / Designation</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="Founder, ABC Traders"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1A56DB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Rating</label>
              <select
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1A56DB]"
              >
                <option value={5}>5 stars</option>
                <option value={4}>4 stars</option>
                <option value={3}>3 stars</option>
                <option value={2}>2 stars</option>
                <option value={1}>1 star</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">Review Scope</label>
              <input
                type="text"
                value={pageType === "service" ? "Service page" : pageType === "location" ? "Location page" : "Homepage / general"}
                disabled
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-gray-700">Your Review *</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows={5}
              placeholder="Tell us what stood out about your experience..."
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#1A56DB]"
            />
          </div>

          <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Your submission will be reviewed by the team before it goes live.
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-[#1A56DB] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}