// src/components/CreateListingPage.jsx
import { useState } from "react";
import DescriptionSection from "./DescriptionSection";
import TypeLocationSection from "./Typelocationsection";
import PriceSection        from "./PriceSection";
import DetailsSection from "./Detailssection";
import FeaturesSection from "./Featureection";
import MediaUploadSection from "./Mediauploadsection";
import FormFooter from "./Formfotter";

const INITIAL_FORM = {
  // Description
  propertyTitle: "",
  description: "",
  // Type & Location
  type: "", purpose: "", label: "",
  state: "", city: "", area: "", address: "",
  // Price
  currency: "NGN", price: "", agencyFee: "", duration: "monthly",
  // Details – Property
  bedrooms: "", bathrooms: "", toilets: "",
  propertySize: "", propertySizePostfix: "Sqft", parking: "",
  // Details – Lands
  noOfPlots: "", landSize: "", landSizePostfix: "Sqft",
  // Features
  features: [], otherFeatures: "",
  // Media
  images: [], videos: [],
};

export default function CreateListingPage() {
  const [form, setForm] = useState(INITIAL_FORM);

  const handleChange = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

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
          onNext={() => console.log("next", form)}
        />
      </div>
    </div>
  );
}