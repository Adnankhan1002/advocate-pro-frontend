'use client';

import React from 'react';
import { ArticleDropdown } from '@/components/ArticleDropdown';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, BookOpen } from 'lucide-react';
import { Article } from '@/lib/articles';

export default function ArticlesPage() {
  const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(null);

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="p-2 sm:p-2.5 md:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0">
          <Scale className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-900 truncate">Constitution Articles</h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 hidden sm:block">Search and reference constitution articles</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Search Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Search Constitution Articles
            </CardTitle>
            <CardDescription>
              Enter an article number or search by keywords to find constitution articles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ArticleDropdown
              onArticleSelect={(article) => {
                setSelectedArticle(article);
                console.log('Selected article:', article);
              }}
              placeholder="Type article number or keywords (e.g., Article 21, fundamental rights)..."
              showFullDetails={true}
            />
          </CardContent>
        </Card>

        {/* Info Card */}
        {!selectedArticle && (
          <Card className="bg-gradient-to-br from-blue-50 to-slate-50 border-blue-100">
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 mb-2">How to use</h3>
                  <ul className="text-xs sm:text-sm text-slate-600 space-y-1.5 sm:space-y-2">
                    <li>• Type an article number (e.g., "21", "14", "32")</li>
                    <li>• Search by keywords (e.g., "fundamental rights")</li>
                    <li>• Click any article to view full content</li>
                    <li className="hidden sm:list-item">• Use this for case preparation and legal research</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
