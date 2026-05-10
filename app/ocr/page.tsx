"use client";
import React, { useState } from 'react';
import { Upload, Camera, Globe, Loader2, X, Check } from 'lucide-react';

interface TranslationResult {
  detectedText: string;
  detectedLanguage: string;
  translatedText: string;
  targetLanguage: string;
}

// HARD-CODED KEYS (replace these)
const VISION_KEY = "AIzaSyA4o9p91MHBNWbK-G-Hco_eOUDUBpaIl2Q";
const TRANSLATE_KEY = "AIzaSyA4o9p91MHBNWbK-G-Hco_eOUDUBpaIl2Q";

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese (Simplified)' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'sa', name: 'Sanskrit' },
  { code: 'la', name: 'Latin' },
  { code: 'el', name: 'Greek' },
];

export default function TranslationDevice() {
  const [image, setImage] = useState<string | null>(null);
  const [targetLang, setTargetLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTranslate = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64Data = image.split(',')[1];

      console.log("🔥 Sending Vision API request...");

      // ---- VISION API ----
      const visionResponse = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${VISION_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            requests: [
              {
                image: { content: base64Data },
                features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
              },
            ],
          }),
        }
      );

      const visionData = await visionResponse.json();
      console.log("📥 Vision Raw Response:", visionData);

      // Guard 1 – Missing responses array
      if (!visionData.responses || !Array.isArray(visionData.responses)) {
        throw new Error("Vision API returned invalid structure.");
      }

      const firstRes = visionData.responses[0];

      // Guard 2 – Vision API error
      if (firstRes?.error) {
        throw new Error(firstRes.error.message || "Vision API error.");
      }

      const detectedText = firstRes.fullTextAnnotation?.text ?? null;
      const detectedLanguage =
        firstRes.fullTextAnnotation?.pages?.[0]?.property?.detectedLanguages?.[0]
          ?.languageCode ?? "unknown";

      if (!detectedText) {
        throw new Error("No text detected in image.");
      }

      console.log("📝 Detected Text:", detectedText);
      console.log("🌐 Detected Language:", detectedLanguage);

      // ---- TRANSLATION API ----
      console.log("🔥 Sending Translation API request...");

      const translationResponse = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${TRANSLATE_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: detectedText,
            target: targetLang,
          }),
        }
      );

      const translationData = await translationResponse.json();
      console.log("📥 Translation Raw Response:", translationData);

      // Guard 3 – Translation error
      if (translationData.error) {
        throw new Error(
          translationData.error.message || "Translation API error."
        );
      }

      // Guard 4 – Missing array
      if (
        !translationData.data ||
        !translationData.data.translations ||
        !translationData.data.translations[0]
      ) {
        throw new Error("Translation API returned no translations.");
      }

      const translatedText = translationData.data.translations[0].translatedText;

      setResult({
        detectedText,
        detectedLanguage: detectedLanguage.toUpperCase(),
        translatedText,
        targetLanguage:
          languages.find((l) => l.code === targetLang)?.name || targetLang,
      });

    } catch (err: any) {
      console.error("❌ Translation Error:", err);
      setError(err?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setImage(null);
    setResult(null);
    setError(null);
  };

  // ---- UI BELOW (unchanged) ----

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Globe className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Ancient Script Translator
            </h1>
          </div>
          <p className="text-gray-600">
            Upload an image of text, manuscript, or ancient scripture to detect and translate
          </p>
        </div>

        {/* CORE BOX */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">

          {/* UPLOAD */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
            {!image ? (
              <label className="cursor-pointer block">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <Camera className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Click to upload an image
                </p>
                <p className="text-sm text-gray-500">Supports JPG, PNG, WebP</p>
              </label>
            ) : (
              <div className="relative">
                <img src={image} alt="Uploaded" className="max-h-96 mx-auto rounded-lg shadow-md" />
                <button
                  onClick={handleClear}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* LANGUAGE SELECT */}
          {image && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Translate to:</label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* BUTTON */}
          {image && (
            <button
              onClick={handleTranslate}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-lg font-medium flex items-center justify-center gap-2 disabled:bg-gray-400"
            >
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <>
                <Globe className="w-5 h-5" /> Detect & Translate
              </>}
            </button>
          )}

          {/* ERROR */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm"><strong>Error:</strong> {error}</p>
            </div>
          )}

          {/* RESULT */}
          {result && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-6 h-6" />
                <h3 className="text-xl font-semibold">Translation Complete!</h3>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Detected Text ({result.detectedLanguage})
                </h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {result.detectedText}
                </p>
              </div>

              <div className="bg-indigo-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Translation ({result.targetLanguage})
                </h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {result.translatedText}
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
