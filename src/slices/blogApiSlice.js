import { createSlice, createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from '../features/api/apiSlice'

const articleAdapter = createEntityAdapter({
  selectId: (article) => article._id
})

const initialState = articleAdapter.getInitialState({
  tagFilter: [],
})

export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getArticles: builder.query({
      query: () => `/blog`,
      transformResponse: responseData => {
        if (responseData) {
          return articleAdapter.setAll(initialState, responseData)
        }
      },
      providesTags: (result = [], error, arg) => [
        {type: 'Blog', id: 'ARTICLES'},
        ...(result?.ids ? result.ids.map(id => ({type: 'Blog', id})) : [])
      ]
    }),

    getArticleById: builder.query({
      query: (id) => `/blog/${id}`,
      transformResponse: responseData => {
        if (responseData) {
          return articleAdapter.upsertOne(initialState, responseData)
        }
      },
      providesTags: (result, error, arg) => [
        {type: 'Blog', id: arg},
      ]
    }),

    getArticleByPath: builder.query({
      query: (relativePath) => `/blog/relative/${relativePath}`,
      transformResponse: responseData => {
        if (responseData) {
          return articleAdapter.upsertOne(initialState, responseData)
        }
      },
      providesTags: (result, error, arg) => [
        {type: 'Blog', id: result?._id},
      ]
    }),

    getLatestArticle: builder.query({
      query: () => `/blog/latest`,
      transformResponse: responseData => {
        if (responseData) {
          return articleAdapter.upsertOne(initialState, responseData)
        }
      },
      providesTags: (result, error, arg) => [
        {type: 'Blog', id: 'ARTICLES'},
        ...(result?.ids ? result.ids.map(id => ({type: 'Blog', id})) : [])
      ]
    }),

    getRandomArticle: builder.query({
      query: (payload) => `/blog/random?exclude=${encodeURIComponent(payload.exclude)}`,
      transformResponse: responseData => {
        if (responseData) {
          return articleAdapter.upsertOne(initialState, responseData)
        }
      },
      providesTags: (result, error, arg) => [
        {type: 'Blog', id: 'ARTICLES'},
        ...(result?.ids ? result.ids.map(id => ({type: 'Blog', id})) : [])
      ]
    }),

    addArticle: builder.mutation({
      query: (article) => ({
        url: '/blog',
        method: 'POST',
        body: article,
      }),
      invalidatesTags: [ {type: 'Blog', id: 'ARTICLES'} ],
    }),

    updateArticle: builder.mutation({
      query: (article) => ({
        url: `/blog/${article._id}`,
        method: 'PUT',
        body: article,
      }),
      invalidatesTags: (result, error, arg) => [
        {type: 'Blog', id: arg._id},
      ]
    }),

    deleteArticle: builder.mutation({
      query: (article) => ({
        url: `/blog/${article._id}`,
        method: 'DELETE',
        body: article,
      }),
      invalidatesTags: (result, error, arg) => [
        {type: 'Blog', id: arg._id},
      ]
    }),
  }),
})

export const { useGetArticlesQuery, useGetArticleByIdQuery, useGetArticleByPathQuery, useGetLatestArticleQuery, useGetRandomArticleQuery, useAddArticleMutation, useUpdateArticleMutation, useDeleteArticleMutation } = extendedApiSlice

// Selectors
export const selectArticlesResult = extendedApiSlice.endpoints.getArticles.select()

const selectArticlesData = createSelector(
  selectArticlesResult,
  (result) => result?.data
)

export const {
  selectAll: selectAllArticles,
  selectById: selectArticleById,
} = articleAdapter.getSelectors(state => selectArticlesData(state) ?? initialState)

export const selectUniqueTags = createSelector(
  selectArticlesResult,
  (result) => {
    const tags = new Set()
    const articles = result?.data
    if (!articles) return []
    articles?.ids?.forEach(id => {
      articles?.entities[id].tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags)
  }
)

// Memoized select filtered articles
export const makeSelectFilteredArticles = () => {
  return createSelector(
    [selectArticlesResult, (_, tagFilter, searchFilter) => [tagFilter, searchFilter]],
    (result, [tagFilter, searchFilter]) => {
      const articles = result?.data;
      if (!articles) return [];

      const tagFiltered = articles.ids.filter(id => {
        const article = articles.entities[id];
        return article.tags.some(tag => tagFilter.includes(tag));
      }).map(id => articles.entities[id]);

      if (!searchFilter && tagFiltered.length > 0) return tagFiltered;

      // basic search by title (uses exact match)
      if (searchFilter) {
        if (tagFiltered.length > 0) {
          return tagFiltered.filter(article => article.title.toLowerCase().includes(searchFilter.toLowerCase()));
        } else {
          return articles.ids.filter(id => {
            const article = articles.entities[id];
            return article.title.toLowerCase().includes(searchFilter.toLowerCase());
          }).map(id => articles.entities[id]);
        }
      }
    }
  );
};
