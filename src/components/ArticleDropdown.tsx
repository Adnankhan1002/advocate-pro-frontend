'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getAllArticles, getArticleByNumber, searchArticles, ArticleListItem, Article } from '@/lib/articles';

interface ArticleDropdownProps {
  onArticleSelect?: (article: Article) => void;
  placeholder?: string;
  className?: string;
  showFullDetails?: boolean;
}

export const ArticleDropdown: React.FC<ArticleDropdownProps> = ({
  onArticleSelect,
  placeholder = 'Search for a constitution article...',
  className = '',
  showFullDetails = true
}) => {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<ArticleListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch all articles on mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        const data = await getAllArticles();
        setArticles(data);
        setFilteredArticles(data);
      } catch (err: any) {
        setError(err.message);
        console.error('Error loading articles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(article =>
        article.article_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.simplified_explanation?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredArticles(filtered);
    }
  }, [searchQuery, articles]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle article selection
  const handleArticleClick = async (articleItem: ArticleListItem) => {
    try {
      setIsLoading(true);
      const fullArticle = await getArticleByNumber(articleItem.article_number);
      setSelectedArticle(fullArticle);
      setSearchQuery(`Article ${fullArticle.article_number}: ${fullArticle.title}`);
      setIsOpen(false);
      
      if (onArticleSelect) {
        onArticleSelect(fullArticle);
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching article details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          disabled={isLoading}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>

      {/* Dropdown List */}
      {isOpen && !isLoading && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          {error ? (
            <div className="px-4 py-3 text-red-600 text-sm">
              Error: {error}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="px-4 py-3 text-gray-500 text-sm">
              No articles found
            </div>
          ) : (
            <ul className="py-1">
              {filteredArticles.map((article) => (
                <li
                  key={article._id}
                  onClick={() => handleArticleClick(article)}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-20 font-semibold text-blue-600">
                      Art. {article.article_number}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{article.title}</div>
                      {article.simplified_explanation && (
                        <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {article.simplified_explanation}
                        </div>
                      )}
                      {article.part && (
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="inline-block px-2 py-1 bg-gray-100 rounded">
                            {article.part}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Selected Article Details */}
      {showFullDetails && selectedArticle && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Article {selectedArticle.article_number}
            </h3>
            <button
              onClick={() => {
                setSelectedArticle(null);
                setSearchQuery('');
              }}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Clear selection"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <h4 className="text-md font-medium text-gray-800 mb-2">
            {selectedArticle.title}
          </h4>
          
          {selectedArticle.part && (
            <div className="mb-3">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {selectedArticle.part}
              </span>
            </div>
          )}
          
          {selectedArticle.simplified_explanation && (
            <div className="mb-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-1">Simplified Explanation:</p>
              <p className="text-sm text-blue-800">
                {selectedArticle.simplified_explanation}
              </p>
            </div>
          )}
          
          {selectedArticle.purpose_and_intent && (
            <div className="mb-3 p-3 bg-amber-50 rounded-lg">
              <p className="text-sm font-medium text-amber-900 mb-1">Purpose & Intent:</p>
              <p className="text-sm text-amber-800">
                {selectedArticle.purpose_and_intent}
              </p>
            </div>
          )}
          
          <div className="p-3 bg-white rounded-lg border border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Original Text:</p>
            <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {selectedArticle.original_text}
            </div>
          </div>
          
          {selectedArticle.keywords && selectedArticle.keywords.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedArticle.keywords.map((keyword, index) => (
                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArticleDropdown;
