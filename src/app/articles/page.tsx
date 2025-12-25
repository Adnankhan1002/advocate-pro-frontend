'use client';

import React from 'react';
import { ArticleDropdown } from '@/components/ArticleDropdown';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, BookOpen } from 'lucide-react';
import { Article } from '@/lib/articles';

export default function ArticlesPage() {
  const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(null);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
          <Scale className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Constitution Articles</h1>
          <p className="text-slate-600">Search and reference constitution articles</p>
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
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-2">How to use</h3>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li>• Type an article number (e.g., "21", "14", "32") to quickly find specific articles</li>
                    <li>• Search by keywords to find related articles (e.g., "fundamental rights", "freedom")</li>
                    <li>• Click on any article from the dropdown to view its full content</li>
                    <li>• Use this for case preparation, legal research, and documentation</li>
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
