import _ from 'lodash'
import { format } from 'date-fns'
import { createSlice } from '@reduxjs/toolkit'

const formStates = {
  BLANK: 'blank',
  PREFILLED: 'prefilled',
}
// Create the slice
const articleFormSlice = createSlice({
  name: 'articleForm',
  initialState: {
    status: 'blank',
    isOpen: false,
    unsavedChanges: false,
    _id: '',
    title: '',
    author: '',
    publishDate: '',
    preview: '',
    content: '',
    tags: '',
    prefilledForm: {}
  },
  reducers: {
    initializeBlankForm: (state) => {
      state.status = formStates.BLANK
      state.title = ''
      state.author = ''
      state.publishDate = format(new Date(), 'yyyy-MM-dd')
      state.preview = ''
      state.content = ''
      state.tags = ''
    },
    initializePrefilledForm: (state, action) => {
      state.status = formStates.PREFILLED
      state._id = action.payload?._id
      state.title = action.payload?.title
      state.author = action.payload?.author
      state.publishDate = action.payload?.publishDate ? format(new Date(action.payload?.publishDate), 'yyyy-MM-dd') : ''
      state.preview = action.payload?.preview
      state.content = action.payload?.content
      state.tags = _.join(action.payload?.tags, ', ')
      state.prefilledForm = { title: state.title, author: state.author, publishDate: state.publishDate, preview: state.preview, content: state.content, tags: state.tags }
    },
    setFormOpen: (state, action) => {
      state.isOpen = action.payload
      state.unsavedChanges = false
    },
    setTitle: (state, action) => {
      state.title = action.payload
      state.unsavedChanges = true
    },
    setAuthor: (state, action) => {
      state.author = action.payload
      state.unsavedChanges = true
    },
    setPublishDate: (state, action) => {
      state.publishDate = action.payload
      state.unsavedChanges = true
    },
    setPreview: (state, action) => {
      state.preview = action.payload
      state.unsavedChanges = true
    },
    setContent: (state, action) => {
      state.content = action.payload
      state.unsavedChanges = true
    },
    setTags: (state, action) => {
      state.tags = action.payload
      state.unsavedChanges = true
    },
    setUnsavedChanges: (state, action) => {
      state.unsavedChanges = action.payload
    },
  }
})

// Export the actions
export const { initializeBlankForm, initializePrefilledForm, setFormOpen, setTitle, setAuthor, setPublishDate, setPreview, setContent, setTags, setUnsavedChanges } = articleFormSlice.actions


// Export the reducer
export default articleFormSlice.reducer
