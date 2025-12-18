import { useState } from "react";

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file) return null;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/uploads/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to upload image");
      }

      const data = await response.json();
      return data.url;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to upload image";
      setError(errorMessage);
      console.error("Image upload error:", err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error, setError };
};
