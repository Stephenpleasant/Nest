// src/components/CreateListingPage.jsx
import { useState } from "react";
import axios from "axios";
import DescriptionSection from "./DescriptionSection";
import TypeLocationSection from "./Typelocationsection";
import PriceSection        from "./PriceSection";
import DetailsSection      from "./Detailssection";
import FeaturesSection     from "./Featureection";
import MediaUploadSection  from "./Mediauploadsection";
import FormFooter          from "./Formfotter";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://gtimeconnect.onrender.com";

const INITIAL_FORM = {
  propertyTitle: "",
  description: "",
  type: "", purpose: "", label: "",
  state: "", city: "", area: "", address: "", zipCode: "",
  currency: "NGN", price: "", agencyFee: "", duration: "monthly",
  // Details section
  bedrooms: "", bathrooms: "", toilets: "",
  propertySize: "", propertySizePostfix: "Sqft", parking: "",
  noOfPlots: "", landSize: "", landSizePostfix: "Sqft",
  // Features
  features: [], otherFeatures: "",
  images: [], videos: [],
};

export default function CreateListingPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError]   = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

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
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      let agentId = null;
      try {
        const a = parsedUser?.agent;
        agentId = (a && (a._id || a.id)) || parsedUser?._id || parsedUser?.id || null;
      } catch (_) {}

      if (!agentId) {
        setSubmitError("Could not find agent ID. Please log out and log in again.");
        setIsSubmitting(false);
        return;
      }

      const fd = new FormData();
      fd.append("title",        form.propertyTitle.trim());
      fd.append("propertyType", form.type);
      fd.append("street",       form.address || "N/A");
      fd.append("city",         form.city);
      fd.append("state",        form.state);
      fd.append("country",      "Nigeria");
      fd.append("zipCode",      form.zipCode || "100001");
      fd.append("price",        Number(form.price));
      fd.append("inspectionFee", Number(form.agencyFee) || 0);
      fd.append("agent",        agentId);

      if (form.description)       fd.append("description",   form.description);
      if (form.area)              fd.append("area",          form.area);
      if (form.purpose)           fd.append("purpose",       form.purpose);
      if (form.label)             fd.append("label",         form.label);
      if (form.duration)          fd.append("duration",      form.duration);
      if (form.currency)          fd.append("currency",      form.currency);
      if (form.otherFeatures?.trim()) fd.append("otherFeatures", form.otherFeatures.trim());

      // Details fields
      if (form.bedrooms)            fd.append("bedrooms",            Number(form.bedrooms));
      if (form.bathrooms)           fd.append("bathrooms",           Number(form.bathrooms));
      if (form.toilets)             fd.append("toilets",             Number(form.toilets));
      if (form.propertySize)        fd.append("propertySize",        form.propertySize);
      if (form.propertySizePostfix) fd.append("propertySizePostfix", form.propertySizePostfix);
      if (form.parking)             fd.append("parking",             Number(form.parking));
      if (form.noOfPlots)           fd.append("noOfPlots",           Number(form.noOfPlots));
      if (form.landSize)            fd.append("landSize",            form.landSize);
      if (form.landSizePostfix)     fd.append("landSizePostfix",     form.landSizePostfix);

      if (form.features.length > 0) {
        form.features.forEach((f) => fd.append("features", f));
      }

      form.images.forEach((img) => fd.append("images", img.file));
      form.videos.forEach((vid) => fd.append("video",  vid.file));

      const { data } = await axios.post(
        `${API_BASE}/api/v1/properties/post`,
        fd,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Property created:", data);
      setSubmitSuccess(true);
      setForm(INITIAL_FORM);
    } catch (err) {
      console.error("Submit error:", err.response?.data);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error   ||
        (typeof err.response?.data === "object"
          ? JSON.stringify(err.response.data, null, 2)
          : null) ||
        "Failed to create listing.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-20 pt-[72px] sm:pt-8">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-7">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Create a Listing</h1>
          <button
            type="button"
            onClick={() => alert("Draft saved!")}
            className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-white text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Save as Draft
          </button>
        </div>

        {submitSuccess && (
          <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
            ✓ Listing created successfully!
          </div>
        )}

        {submitError && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm whitespace-pre-wrap">
            ⚠ {submitError}
          </div>
        )}

        <DescriptionSection  data={form} onChange={handleChange} />
        <TypeLocationSection data={form} onChange={handleChange} />
        <PriceSection        data={form} onChange={handleChange} />
        <DetailsSection      data={form} onChange={handleChange} />
        <FeaturesSection     data={form} onChange={handleChange} />
        <MediaUploadSection  data={form} onChange={handleChange} />

        <FormFooter
          onBack={() => console.log("back")}
          onNext={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}