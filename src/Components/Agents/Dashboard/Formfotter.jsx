// src/components/FormFooter.jsx

export default function FormFooter({ onBack, onNext }) {
    return (
      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          ‹ Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 rounded-lg text-sm font-semibold text-white hover:bg-gray-800 transition"
        >
          Next ›
        </button>
      </div>
    );
  }