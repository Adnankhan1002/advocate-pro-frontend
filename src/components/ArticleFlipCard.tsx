'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { TextToSpeech } from '@/components/TextToSpeech';
import { Article } from '@/lib/articles';
import { RotateCcw } from 'lucide-react';

interface ArticleFlipCardProps {
  article: Article;
  onClose: () => void;
}

export const ArticleFlipCard: React.FC<ArticleFlipCardProps> = ({ article, onClose }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setCurrentSlide(0); // Reset to first slide when flipping
  };

  // Create slides array based on available content
  const slides = [];
  
  if (article.simplified_explanation) {
    slides.push({
      type: 'simplified',
      title: 'Simplified Explanation',
      content: article.simplified_explanation,
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      titleColor: 'text-blue-900',
    });
  }
  
  if (article.purpose_and_intent) {
    slides.push({
      type: 'purpose',
      title: 'Purpose & Intent',
      content: article.purpose_and_intent,
      bgColor: 'from-amber-50 to-amber-100',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-800',
      titleColor: 'text-amber-900',
    });
  }
  
  slides.push({
    type: 'original',
    title: 'Original Text',
    content: article.original_text,
    bgColor: 'from-gray-50 to-gray-100',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-700',
    titleColor: 'text-gray-900',
  });

  const totalSlides = slides.length;

  // Handle touch events for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    const diff = currentTouch - touchStart;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    } else if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
    setIsDragging(false);
    setDragOffset(0);
  };

  // Handle mouse events for desktop drag
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setTouchStart(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const currentX = e.clientX;
    setTouchEnd(currentX);
    const diff = currentX - touchStart;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setDragOffset(0);
      return;
    }
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    } else if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="mt-4" style={{ perspective: '1000px' }}>
      <div
        className="relative w-full"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.7s',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front of Card */}
        <div
          className="w-full min-h-[400px] sm:min-h-[500px]"
          style={{
            backfaceVisibility: 'hidden',
            display: isFlipped ? 'none' : 'block',
          }}
        >
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border-2 sm:border-4 border-amber-500 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-xl sm:shadow-2xl">
            {/* Decorative Top Border */}
            <div className="h-2 sm:h-4 bg-gradient-to-r from-orange-500 via-white to-green-600"></div>
            
            {/* National Emblem */}
            <div className="flex justify-center pt-4 pb-3 sm:pt-8 sm:pb-4">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-white shadow-lg overflow-hidden flex items-center justify-center">
                <Image
                  src="/images/national-emblem.jpg"
                  alt="National Emblem of India"
                  width={160}
                  height={160}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-6 text-center space-y-3 sm:space-y-4 md:space-y-6">
              <div className="space-y-1 sm:space-y-2">
                <h2 className="text-sm sm:text-lg md:text-2xl font-bold text-gray-800 tracking-wide">
                  CONSTITUTION OF INDIA
                </h2>
                <div className="h-0.5 sm:h-1 w-20 sm:w-28 md:w-32 mx-auto bg-gradient-to-r from-orange-500 via-amber-500 to-green-600 rounded-full"></div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-amber-700">
                  Article {article.article_number}
                </h3>
                <p className="text-sm sm:text-base md:text-xl font-semibold text-gray-700 px-2 sm:px-4 leading-tight">
                  {article.title}
                </p>
              </div>

              {article.part && (
                <div className="pt-2 sm:pt-4">
                  <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs sm:text-sm font-semibold rounded-full shadow-md">
                    {article.part}
                  </span>
                </div>
              )}

              {/* Click to flip instruction */}
              <div className="pt-4 pb-2 sm:pt-6 sm:pb-4 md:pt-8">
                <button
                  onClick={handleFlip}
                  className="group relative inline-flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs sm:text-sm md:text-base font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 active:scale-95 sm:hover:scale-105"
                >
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="hidden sm:inline">Click to view full details</span>
                  <span className="sm:hidden">View Details</span>
                </button>
              </div>
            </div>

            {/* Decorative Bottom Border */}
            <div className="h-2 sm:h-4 bg-gradient-to-r from-green-600 via-white to-orange-500"></div>
            
            {/* Decorative Corners */}
            <div className="absolute top-3 left-3 sm:top-6 sm:left-6 w-4 h-4 sm:w-8 sm:h-8 border-t-2 border-l-2 sm:border-t-4 sm:border-l-4 border-amber-600"></div>
            <div className="absolute top-3 right-3 sm:top-6 sm:right-6 w-4 h-4 sm:w-8 sm:h-8 border-t-2 border-r-2 sm:border-t-4 sm:border-r-4 border-amber-600"></div>
            <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 w-4 h-4 sm:w-8 sm:h-8 border-b-2 border-l-2 sm:border-b-4 sm:border-l-4 border-amber-600"></div>
            <div className="absolute bottom-3 right-3 sm:bottom-6 sm:right-6 w-4 h-4 sm:w-8 sm:h-8 border-b-2 border-r-2 sm:border-b-4 sm:border-r-4 border-amber-600"></div>
          </div>
        </div>

        {/* Back of Card */}
        <div
          className="absolute top-0 left-0 w-full min-h-[400px] sm:min-h-[500px]"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: isFlipped ? 'block' : 'none',
          }}
        >
          <div className="relative rounded-xl sm:rounded-2xl border border-gray-200 sm:border-2 bg-white shadow-xl sm:shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-3 sm:px-4 sm:py-3.5 md:px-6 md:py-4">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-xl md:text-2xl font-bold truncate">Article {article.article_number}</h3>
                  <p className="text-blue-100 mt-0.5 sm:mt-1 text-xs sm:text-sm line-clamp-2">{article.title}</p>
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <TextToSpeech
                    text={`
                      Article ${article.article_number}. 
                      ${article.title}. 
                      ${article.simplified_explanation ? 'Simplified Explanation: ' + article.simplified_explanation : ''}
                      ${article.purpose_and_intent ? 'Purpose and Intent: ' + article.purpose_and_intent : ''}
                      Original Text: ${article.original_text}
                    `}
                    title={`Article ${article.article_number}`}
                    buttonSize="sm"
                    showLabel={false}
                  />
                  <button
                    onClick={onClose}
                    className="text-white hover:text-blue-200 transition-colors p-1"
                    aria-label="Close"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Part Badge */}
              {article.part && (
                <div className="mt-2 sm:mt-3">
                  <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs sm:text-sm font-semibold rounded-full shadow-md">
                    {article.part}
                  </span>
                </div>
              )}
            </div>

            {/* Carousel Container */}
            <div className="relative overflow-hidden select-none">
              {/* Slides Wrapper */}
              <div
                ref={sliderRef}
                className={`flex ${isDragging ? '' : 'transition-transform duration-500 ease-out'}`}
                style={{ 
                  transform: `translateX(calc(-${currentSlide * 100}% + ${isDragging ? dragOffset : 0}px))`,
                  cursor: isDragging ? 'grabbing' : 'grab'
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
              >
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className="min-w-full px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6"
                  >
                    <div className={`p-4 sm:p-5 md:p-6 bg-gradient-to-br ${slide.bgColor} rounded-lg sm:rounded-xl border ${slide.borderColor} shadow-sm min-h-[280px] sm:min-h-[320px] md:min-h-[350px] flex flex-col`}>
                      <div className="flex justify-between items-start mb-3 sm:mb-4 gap-2">
                        <p className={`text-xs sm:text-sm font-bold ${slide.titleColor} uppercase tracking-wide`}>
                          {slide.title}
                        </p>
                        <TextToSpeech
                          text={slide.content}
                          buttonSize="sm"
                          showLabel={false}
                          className="flex-shrink-0"
                        />
                      </div>
                      <div className={`text-xs sm:text-sm ${slide.textColor} leading-relaxed whitespace-pre-wrap flex-1 overflow-y-auto max-h-[220px] sm:max-h-[260px] md:max-h-[280px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2`}>
                        {slide.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Swipe Indicator - Shows when there are multiple slides */}
              {totalSlides > 1 && !isDragging && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm pointer-events-none opacity-0 animate-fade-in-out">
                  Swipe to navigate
                </div>
              )}
            </div>

            {/* Pagination Dots */}
            {totalSlides > 1 && (
              <div className="flex justify-center items-center gap-2 py-3 sm:py-4 bg-gray-50">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`transition-all duration-300 rounded-full ${
                      currentSlide === index
                        ? 'w-8 sm:w-10 h-2 sm:h-2.5 bg-blue-600'
                        : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Slide Counter & Keywords */}
            <div className="px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-4 bg-white border-t border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                {/* Slide Counter */}
                {totalSlides > 1 && (
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">
                    <span className="text-blue-600 font-bold">{currentSlide + 1}</span> / {totalSlides}
                  </div>
                )}

                {/* Keywords */}
                {article.keywords && article.keywords.length > 0 && (
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-gray-600 mb-1.5 sm:mb-2 uppercase tracking-wide">Keywords</p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {article.keywords.slice(0, 4).map((keyword, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 sm:px-3 sm:py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs font-medium rounded-full border border-gray-300 shadow-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                      {article.keywords.length > 4 && (
                        <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                          +{article.keywords.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Flip back button */}
            <div className="px-3 pb-3 sm:px-4 sm:pb-4 md:px-6 md:pb-4 flex justify-center bg-white">
              <button
                onClick={handleFlip}
                className="group inline-flex items-center gap-1.5 sm:gap-2 px-4 py-1.5 sm:px-6 sm:py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-180 transition-transform duration-500" />
                <span className="hidden sm:inline">Flip back to front</span>
                <span className="sm:hidden">Back to Front</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleFlipCard;
