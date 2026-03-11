// src/Components/Agents/Dashboard/EditListingPage.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import DescriptionSection  from "./DescriptionSection";
import TypeLocationSection from "./Typelocationsection";
import PriceSection        from "./PriceSection";
import FeaturesSection     from "./Featureection";
import MediaUploadSection  from "./Mediauploadsection";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://gtimeconnect.onrender.com";

const EMPTY_FORM = {
  propertyTitle: "",
  description: "",
  type: "", purpose: "", label: "",
  state: "", city: "", area: "", address: "", zipCode: "",
  currency: "NGN", price: "", agencyFee: "", duration: "monthly",
  features: [], otherFeatures: "",
  images: [], videos: [],
};

// Map API response fields → form fields
const apiToForm = (p) => ({
  propertyTitle: p.title        || "",
  description:   p.description  || "",
  type:          p.propertyType || p.type    || "",
  purpose:       p.purpose      || "",
  label:         p.label        || "",
  state:         p.state        || "",
  city:          p.city         || "",
  area:          p.area         || "",
  address:       p.street       || p.address || "",
  zipCode:       p.zipCode      || "",
  currency:      p.currency     || "NGN",
  price:         p.price        ? String(p.price) : "",
  agencyFee:     p.inspectionFee ? String(p.inspectionFee) : "",
  duration:      p.duration     || "monthly",
  features:      Array.isArray(p.features) ? p.features : [],
  otherFeatures: p.otherFeatures || "",
  // Existing images from API — kept as { url, name } (no .file means they're already uploaded)
  images: Array.isArray(p.images)
    ? p.images.map((img) => ({
        url:  typeof img === "string" ? img : (img.url || img),
        name: typeof img === "string" ? "image" : (img.name || "image"),
        existing: true,
      }))
    : [],
  videos: p.video
    ? [{ url: p.video, name: "video", existing: true }]
    : [],
});

export default function EditListingPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const location   = useLocation();

  const [form, setForm]               = useState(EMPTY_FORM);
  const [loading, setLoading]         = useState(true);
  const [fetchError, setFetchError]   = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const descEditorRef = useRef(null);

  // ── Load property — from router state (passed by dashboard) or fetch fallback ──
  useEffect(() => {
    const passedListing = location.state?.listing;

    if (passedListing) {
      // Data already available — no API call needed
      const mapped = apiToForm(passedListing);
      setForm(mapped);
      setLoading(false);
      return;
    }

    // Fallback: try common single-property endpoints
    const fetchProperty = async () => {
      setLoading(true);
      setFetchError("");
      const token = localStorage.getItem("token");
      const endpoints = [
        `${API_BASE}/api/v1/properties/single/${id}`,
        `${API_BASE}/api/v1/properties/get/${id}`,
        `${API_BASE}/api/v1/properties/${id}`,
      ];

      for (const url of endpoints) {
        try {
          const { data } = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
          const property = data?.property || data?.data || data;
          if (property && (property._id || property.id || property.title)) {
            const mapped = apiToForm(property);
            setForm(mapped);
            setLoading(false);
            return;
          }
        } catch (_) { /* try next */ }
      }

      setFetchError("Failed to load property. Please go back and try again.");
      setLoading(false);
    };

    if (id) fetchProperty();
  }, [id]);

  const handleChange = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  // ── Submit updated property ──
  const handleSubmit = async () => {
    setSubmitError("");

    if (!form.propertyTitle.trim()) return setSubmitError("Property title is required.");
    if (!form.type)                 return setSubmitError("Please select a property type.");
    if (!form.state)                return setSubmitError("Please select a state.");
    if (!form.city)                 return setSubmitError("Please select a city.");
    if (!form.price)                return setSubmitError("Price is required.");

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      const fd = new FormData();
      fd.append("title",         form.propertyTitle.trim());
      fd.append("propertyType",  form.type);
      fd.append("street",        form.address || "N/A");
      fd.append("city",          form.city);
      fd.append("state",         form.state);
      fd.append("country",       "Nigeria");
      fd.append("zipCode",       form.zipCode || "100001");
      fd.append("price",         Number(form.price));
      fd.append("inspectionFee", Number(form.agencyFee) || 0);

      if (form.description)           fd.append("description",   form.description);
      if (form.area)                  fd.append("area",          form.area);
      if (form.purpose)               fd.append("purpose",       form.purpose);
      if (form.label)                 fd.append("label",         form.label);
      if (form.duration)              fd.append("duration",      form.duration);
      if (form.currency)              fd.append("currency",      form.currency);
      if (form.otherFeatures?.trim()) fd.append("otherFeatures", form.otherFeatures.trim());

      if (form.features.length > 0) {
        form.features.forEach((f) => fd.append("features", f));
      }

      // Only append NEW images (ones with a .file property)
      form.images.forEach((img) => {
        if (img.file) fd.append("images", img.file);
      });
      form.videos.forEach((vid) => {
        if (vid.file) fd.append("video", vid.file);
      });

      await axios.put(
        `${API_BASE}/api/v1/properties/edit/${id}`,
        fd,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSubmitSuccess(true);
      setTimeout(() => navigate("/agent-dashboard"), 1500);
    } catch (err) {
      console.error("Update error:", err.response?.data);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error   ||
        (typeof err.response?.data === "object"
          ? JSON.stringify(err.response.data, null, 2)
          : null) ||
        "Failed to update listing.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Loading state ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading property...</p>
        </div>
      </div>
    );
  }

  // ── Fetch error state ──
  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-red-200 p-6 max-w-md w-full text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-base font-bold text-gray-900 mb-2">Could not load property</h2>
          <p className="text-sm text-red-600 mb-4">{fetchError}</p>
          <button
            onClick={() => navigate("/agent-dashboard")}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-20 pt-[72px] sm:pt-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-7">
          <div>
            <button
              onClick={() => navigate("/agent-dashboard")}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium mb-1 flex items-center gap-1"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Edit Listing</h1>
          </div>
        </div>

        {/* Success banner */}
        {submitSuccess && (
          <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium flex items-center gap-2">
            ✓ Listing updated successfully! Redirecting...
          </div>
        )}

        {/* Error banner */}
        {submitError && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm whitespace-pre-wrap">
            ⚠ {submitError}
          </div>
        )}

        <DescriptionSection  data={form} onChange={handleChange} />
        <TypeLocationSection data={form} onChange={handleChange} />
        <PriceSection        data={form} onChange={handleChange} />
        <FeaturesSection     data={form} onChange={handleChange} />
        <MediaUploadSection  data={form} onChange={handleChange} />

        {/* Footer buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate("/agent-dashboard")}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            ‹ Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || submitSuccess}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving…
              </>
            ) : "Save Changes ›"}
          </button>
        </div>
      </div>
    </div>
  );
}