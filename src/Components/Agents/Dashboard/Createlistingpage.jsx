// src/components/CreateListingPage.jsx
import { useState } from "react";
import axios from "axios";
import DescriptionSection from "./DescriptionSection";
import TypeLocationSection from "./Typelocationsection";
import PriceSection        from "./PriceSection";
import DetailsSection from "./Detailssection";
import FeaturesSection from "./Featureection";
import MediaUploadSection from "./Mediauploadsection";
import FormFooter from "./Formfotter";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://gtimeconnect.onrender.com";

const INITIAL_FORM = {
  // Description
  propertyTitle: "",
  description: "",
  // Type & Location
  type: "", purpose: "", label: "",
  state: "", city: "", area: "", address: "", zipCode: "",
  // Price
  currency: "NGN", price: "", agencyFee: "", duration: "monthly",
  // Details – Property
  bedrooms: "", bathrooms: "", toilets: "",
  propertySize: "", propertySizePostfix: "Sqft", parking: "",
  yearBuilt: "",
  // Details – Lands
  noOfPlots: "", landSize: "", landSizePostfix: "Sqft",
  // Features
  features: [], otherFeatures: "",
  // Media
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

    // ── Client-side validation ──
    if (!form.propertyTitle.trim()) return setSubmitError("Property title is required.");
    if (!form.type)                 return setSubmitError("Please select a property type.");
    if (!form.state)                return setSubmitError("Please select a state.");
    if (!form.city)                 return setSubmitError("Please select a city.");
    if (!form.price)                return setSubmitError("Price is required.");

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");

      // ── Get agent ID from stored user object ──
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      // The API returns { agent: { _id, fullName, ... } } on agent login.
      // We confirmed via console: parsedUser.agent._id = "69af308a47d04fa9c818ab26"
      // Extract it safely with explicit fallback chain:
      let agentId = null;
      try {
        const a = parsedUser?.agent;
        agentId = (a && (a._id || a.id))
          || parsedUser?._id
          || parsedUser?.id
          || null;
      } catch(_) {}

      console.log("parsedUser.agent:", parsedUser?.agent);
      console.log("Resolved agentId:", agentId);

      if (!agentId) {
        setSubmitError(
          "Could not find agent ID. Raw user: " + JSON.stringify(parsedUser)
        );
        setIsSubmitting(false);
        return;
      }

      // ── Build payload matching EXACTLY what the API expects ──
      // Based on API docs: title, street, city, state, zipCode, country,
      // inspectionFee, price, bedrooms, bathrooms, squareFeet, yearBuilt,
      // propertyType, features, garage, lotSize, description, agent
      const payload = {
        title:          form.propertyTitle.trim(),
        description:    form.description,
        propertyType:   form.type,           // already lowercase from TypeLocationSection
        street:         form.address || "",
        city:           form.city,
        state:          form.state,
        country:        "Nigeria",
        zipCode:        form.zipCode || "100001",
        price:          Number(form.price),
        inspectionFee:  Number(form.agencyFee) || 0,
        agent:          agentId,             // MongoDB ObjectId string from parsedUser.agent._id
      };

      // ── Optional numeric fields — only include if filled ──
      if (form.bedrooms)    payload.bedrooms    = Number(form.bedrooms);
      if (form.bathrooms)   payload.bathrooms   = Number(form.bathrooms);
      if (form.toilets)     payload.toilets     = Number(form.toilets);
      if (form.propertySize) payload.squareFeet = Number(form.propertySize);
      if (form.parking)     payload.garage      = Number(form.parking);
      if (form.landSize)    payload.lotSize     = Number(form.landSize);
      if (form.noOfPlots)   payload.noOfPlots   = Number(form.noOfPlots);
      if (form.yearBuilt)   payload.yearBuilt   = Number(form.yearBuilt);

      // ── Optional string/array fields ──
      if (form.area)                        payload.area          = form.area;
      if (form.features.length > 0)         payload.features      = form.features;
      if (form.otherFeatures?.trim())       payload.otherFeatures = form.otherFeatures.trim();

      // ── These fields exist in the form UI but may not be supported by the API ──
      // Only include them if the API starts accepting them
      if (form.purpose) payload.purpose  = form.purpose;
      if (form.label)   payload.label    = form.label;
      if (form.duration) payload.duration = form.duration;
      if (form.currency) payload.currency = form.currency;

      console.log("Full payload being sent:", JSON.stringify(payload, null, 2));

      // ── Step 1: Create the property ──
      const { data } = await axios.post(
        `${API_BASE}/api/v1/properties/post`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Property created:", data);

      // ── Step 2: Upload media if any (separate multipart request) ──
      const propertyId = data?.data?._id || data?._id;
      const hasMedia = form.images.length > 0 || form.videos.length > 0;

      if (propertyId && hasMedia) {
        const mediaForm = new FormData();
        form.images.forEach((img) => mediaForm.append("images", img.file));
        form.videos.forEach((vid) => mediaForm.append("videos", vid.file));

        await axios.post(
          `${API_BASE}/api/v1/properties/${propertyId}/media`,
          mediaForm,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      setSubmitSuccess(true);
      setForm(INITIAL_FORM);
    } catch (err) {
      // Log the full error response to help debug
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
      <div className="max-w-3xl mx-auto px-6 py-8 pb-20">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-7">
          <h1 className="text-xl font-bold text-gray-900">Create a Listing</h1>
          <button
            type="button"
            onClick={() => alert("Draft saved!")}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            Save as Draft
          </button>
        </div>

        {/* Success message */}
        {submitSuccess && (
          <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
            ✓ Listing created successfully!
          </div>
        )}

        {/* Error message */}
        {submitError && (
          <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm whitespace-pre-wrap">
            ⚠ {submitError}
          </div>
        )}

        {/* Sections */}
        <DescriptionSection  data={form} onChange={handleChange} />
        <TypeLocationSection data={form} onChange={handleChange} />
        <PriceSection        data={form} onChange={handleChange} />
        <DetailsSection      data={form} onChange={handleChange} />
        <FeaturesSection     data={form} onChange={handleChange} />
        <MediaUploadSection  data={form} onChange={handleChange} />

        {/* Footer Nav */}
        <FormFooter
          onBack={() => console.log("back")}
          onNext={handleSubmit}
          isLoading={isSubmitting}
        />
      </div>
    </div>
  );
}