
const getUrl = (() => {
  if (process.env.REACT_APP_ENV === 'dev') {
    return process.env.REACT_APP_DEV_URL
  } else if (process.env.REACT_APP_ENV === 'prod') {
    return process.env.REACT_APP_PROD_URL
  } else {
    throw new Error('Invalid REACT_APP_ENV in .env file. Set to "dev" or "prod"')
  }
})

const baseUrl = getUrl()

if (!baseUrl) {
  throw new Error('Invalid .env configuration. Set the REACT_APP_DEV_URL and REACT_APP_PROD_URL variables in the .env file set the REACT_APP_ENV variable to "dev" or "prod"')
}

export { baseUrl }