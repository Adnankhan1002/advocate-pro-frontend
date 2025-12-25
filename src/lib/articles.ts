import { getApiClient } from './api';

export interface Article {
  _id: string;
  article_number: string;
  title: string;
  part?: string;
  chapter?: string;
  original_text: string;
  simplified_explanation?: string;
  purpose_and_intent?: string;
  clauses_breakdown?: any[];
  amendments?: any[];
  practical_examples?: any[];
  related_articles?: any[];
  keywords?: string[];
  key_judicial_interpretations?: any[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleListItem {
  _id: string;
  article_number: string;
  title: string;
  simplified_explanation?: string;
  part?: string;
}

export interface ArticlesResponse {
  success: boolean;
  count: number;
  data: Article[] | ArticleListItem[];
}

export interface ArticleResponse {
  success: boolean;
  data: Article;
}

/**
 * Get all articles
 */
export const getAllArticles = async (): Promise<ArticleListItem[]> => {
  try {
    const api = getApiClient();
    const response = await api.get<ArticlesResponse>('/articles');
    return response.data.data as ArticleListItem[];
  } catch (error: any) {
    console.error('Error fetching articles:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch articles');
  }
};

/**
 * Get article by article number
 */
export const getArticleByNumber = async (article_number: string): Promise<Article> => {
  try {
    const api = getApiClient();
    const response = await api.get<ArticleResponse>(`/articles/${article_number}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching article:', error);
    throw new Error(error.response?.data?.message || `Failed to fetch article ${article_number}`);
  }
};

/**
 * Search articles
 */
export const searchArticles = async (query: string): Promise<ArticleListItem[]> => {
  try {
    const api = getApiClient();
    const response = await api.get<ArticlesResponse>('/articles/search', {
      params: { q: query }
    });
    return response.data.data as ArticleListItem[];
  } catch (error: any) {
    console.error('Error searching articles:', error);
    throw new Error(error.response?.data?.message || 'Failed to search articles');
  }
};

/**
 * Get articles by category
 */
export const getArticlesByCategory = async (category: string): Promise<ArticleListItem[]> => {
  try {
    const api = getApiClient();
    const response = await api.get<ArticlesResponse>(`/articles/category/${category}`);
    return response.data.data as ArticleListItem[];
  } catch (error: any) {
    console.error('Error fetching articles by category:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch articles by category');
  }
};

/**
 * Create a new article
 */
export const createArticle = async (articleData: {
  article_number: string;
  title: string;
  original_text: string;
  simplified_explanation?: string;
  part?: string;
  chapter?: string;
  purpose_and_intent?: string;
}): Promise<Article> => {
  try {
    const api = getApiClient();
    const response = await api.post<ArticleResponse>('/articles', articleData);
    return response.data.data;
  } catch (error: any) {
    console.error('Error creating article:', error);
    throw new Error(error.response?.data?.message || 'Failed to create article');
  }
};

/**
 * Update an article
 */
export const updateArticle = async (
  id: string,
  articleData: Partial<{
    article_number: string;
    title: string;
    original_text: string;
    simplified_explanation: string;
    part: string;
    chapter: string;
    purpose_and_intent: string;
    isActive: boolean;
  }>
): Promise<Article> => {
  try {
    const api = getApiClient();
    const response = await api.put<ArticleResponse>(`/articles/${id}`, articleData);
    return response.data.data;
  } catch (error: any) {
    console.error('Error updating article:', error);
    throw new Error(error.response?.data?.message || 'Failed to update article');
  }
};

/**
 * Delete an article
 */
export const deleteArticle = async (id: string): Promise<void> => {
  try {
    const api = getApiClient();
    await api.delete(`/articles/${id}`);
  } catch (error: any) {
    console.error('Error deleting article:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete article');
  }
};
