import React from "react";
import { getProxiedImageUrl } from "../src/utils/imageProxy";

interface CoverImageProps {
  src?: string | null;
  alt: string;
}

const CoverImage: React.FC<CoverImageProps> = ({ src, alt }) => {
  if (!src) {
    return null;
  }

  return (
    <div className="relative w-full h-80 sm:h-96 md:h-[420px] overflow-hidden rounded-3xl mb-10 bg-gray-100">
      <img
        src={getProxiedImageUrl(src) || src || ""}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
      />
    </div>
  );
};

export default CoverImage;
