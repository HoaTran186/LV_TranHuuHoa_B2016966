"use client";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface ImageData {
  id: number;
  images: string;
  productId: number;
}

interface ThumbnailCarouselProps {
  productId: number | null;
}

const ThumbnailCarousel: React.FC<ThumbnailCarouselProps> = ({ productId }) => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    const fetchImages = async () => {
      if (productId !== null) {
        try {
          const response = await fetch(
            `http://localhost:5126/api/productimages/${productId}`
          );

          if (!response.ok) {
            throw new Error("Failed to fetch images");
          }

          const imageData: ImageData[] = await response.json();

          const imageUrls = imageData.map(
            (item) => `http://localhost:5126/Resources/${item.images.trim()}`
          );
          setImages(imageUrls);
        } catch (error) {
          console.error("Error fetching images:", error);
        }
      }
    };

    fetchImages();
  }, [productId]);

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="overflow-hidden h-[30rem] mx-">
        {images.length > 0 ? (
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex}`}
            className="object-cover w-full h-full rounded-lg"
          />
        ) : (
          <p>Loading images...</p>
        )}
      </div>

      {/* Thumbnails with spacing */}
      <div className="flex justify-center -mt-20 space-x-4">
        {images.map((image, index) => (
          <div
            key={index}
            className={`p-1 rounded-lg cursor-pointer border-2 ${
              currentIndex === index ? "border-blue-500" : "border-transparent"
            }`}
            onClick={() => handleThumbnailClick(index)}
          >
            <img
              src={image}
              alt={`Thumbnail ${index}`}
              className={`w-16 h-16 object-cover rounded-lg ${
                currentIndex === index && "ring-2 ring-blue-500"
              }`}
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <Button
        onClick={prevSlide}
        className="absolute top-1/2 left-5 transform -translate-y-1/2 bg-white text-black px-3 py-2 rounded-full shadow-md hover:bg-gray-200"
      >
        <FaArrowLeft />
      </Button>
      <Button
        onClick={nextSlide}
        className="absolute top-1/2 right-5 transform -translate-y-1/2 bg-white text-black px-3 py-2 rounded-full shadow-md hover:bg-gray-200"
      >
        <FaArrowRight />
      </Button>
    </div>
  );
};

export default ThumbnailCarousel;
