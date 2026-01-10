'use client';

import React, { useState } from 'react';
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

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
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
          className="w-full min-h-[500px]"
          style={{
            backfaceVisibility: 'hidden',
            display: isFlipped ? 'none' : 'block',
          }}
        >
          <div className="relative overflow-hidden rounded-2xl border-4 border-amber-500 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-2xl">
            {/* Decorative Top Border */}
            <div className="h-4 bg-gradient-to-r from-orange-500 via-white to-green-600"></div>
            
            {/* National Emblem */}
            <div className="flex justify-center pt-8 pb-4">
              <div className="relative w-40 h-40 rounded-full bg-white shadow-lg overflow-hidden flex items-center justify-center">
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
            <div className="px-8 py-6 text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-800 tracking-wide">
                  CONSTITUTION OF INDIA
                </h2>
                <div className="h-1 w-32 mx-auto bg-gradient-to-r from-orange-500 via-amber-500 to-green-600 rounded-full"></div>
              </div>

              <div className="space-y-3">
                <h3 className="text-5xl font-bold text-amber-700">
                  Article {article.article_number}
                </h3>
                <p className="text-xl font-semibold text-gray-700 px-4">
                  {article.title}
                </p>
              </div>

              {article.part && (
                <div className="pt-4">
                  <span className="inline-block px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-sm font-semibold rounded-full shadow-md">
                    {article.part}
                  </span>
                </div>
              )}

              {/* Click to flip instruction */}
              <div className="pt-8 pb-4">
                <button
                  onClick={handleFlip}
                  className="group relative inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105"
                >
                  <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                  Click to view full details
                </button>
              </div>
            </div>

            {/* Decorative Bottom Border */}
            <div className="h-4 bg-gradient-to-r from-green-600 via-white to-orange-500"></div>
            
            {/* Decorative Corners */}
            <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-amber-600"></div>
            <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-amber-600"></div>
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-amber-600"></div>
            <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-amber-600"></div>
          </div>
        </div>

        {/* Back of Card */}
        <div
          className="absolute top-0 left-0 w-full min-h-[500px]"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: isFlipped ? 'block' : 'none',
          }}
        >
          <div className="relative rounded-2xl border-2 border-gray-200 bg-white shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold">Article {article.article_number}</h3>
                  <p className="text-blue-100 mt-1">{article.title}</p>
                </div>
                <div className="flex items-center gap-2">
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
                    className="text-white hover:text-blue-200 transition-colors"
                    aria-label="Close"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
              {article.part && (
                <div className="mb-4">
                  <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-sm font-semibold rounded-full shadow-md">
                    {article.part}
                  </span>
                </div>
              )}

              {article.simplified_explanation && (
                <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-bold text-blue-900 uppercase tracking-wide">Simplified Explanation</p>
                    <TextToSpeech
                      text={article.simplified_explanation}
                      buttonSize="sm"
                      showLabel={false}
                      className="-mt-1"
                    />
                  </div>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {article.simplified_explanation}
                  </p>
                </div>
              )}

              {article.purpose_and_intent && (
                <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-bold text-amber-900 uppercase tracking-wide">Purpose & Intent</p>
                    <TextToSpeech
                      text={article.purpose_and_intent}
                      buttonSize="sm"
                      showLabel={false}
                      className="-mt-1"
                    />
                  </div>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    {article.purpose_and_intent}
                  </p>
                </div>
              )}

              <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-bold text-gray-900 uppercase tracking-wide">Original Text</p>
                  <TextToSpeech
                    text={article.original_text}
                    buttonSize="sm"
                    showLabel={false}
                    className="-mt-1"
                  />
                </div>
                <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {article.original_text}
                </div>
              </div>

              {article.keywords && article.keywords.length > 0 && (
                <div className="pt-2">
                  <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {article.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-xs font-medium rounded-full border border-gray-300 shadow-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Flip back button */}
              <div className="pt-4 flex justify-center">
                <button
                  onClick={handleFlip}
                  className="group inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
                >
                  <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                  Flip back to front
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleFlipCard;
