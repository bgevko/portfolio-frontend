import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import shellReducer from './slices/shellSlice'
import appReducer from './slices/appSlice'
import articleFormReducer from './slices/articleFormSlice'
import { apiSlice } from './features/api/apiSlice'
import { rtkQueryErrorLogger } from './features/middleware/errorMiddleware'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    shell: shellReducer,
    app: appReducer,
    articleForm: articleFormReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware, rtkQueryErrorLogger),
})

setupListeners(store.dispatch)