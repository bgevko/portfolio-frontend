
const getUrl = (() => {
  if (import.meta.env.VITE_ENV === 'dev') {
    return import.meta.env.VITE_DEV_URL
  } else if (import.meta.env.VITE_ENV === 'prod') {
    return import.meta.env.VITE_PROD_URL
  } else {
    throw new Error('Invalid VITE_ENV in .env file. Set to "dev" or "prod"')
  }
})

const baseUrl = getUrl()

if (!baseUrl) {
  throw new Error('Invalid .env configuration. Set the VITE_DEV_URL and VITE_PROD_URL variables in the .env file set the VITE_ENV variable to "dev" or "prod"')
}

export { baseUrl }
