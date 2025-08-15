import axios from 'axios'

export function setAxiosHeaders(headers: Record<string, string>) {
  Object.assign(instance.defaults.headers.common, headers)
}

const instance = axios.create({
  baseURL:  import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
})

export const AXIOS_REQUEST_RETRIES = 3

instance.interceptors.request.use(
  (config) => {
    // Check for X-Session-ID in headers
    if (!config.headers['X-Session-ID']) {
      // Optionally, you can throw a custom error
      return Promise.reject(new Error('X-Session-ID header is missing'));
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {

    // Пример хэндлинга обновления токена 
    // const newCSRFToken = error.response?.data?.refreshed_csrf_token
    // if (!newCSRFToken) {
    //   return Promise.reject(error)
    // }

    // setAxiosHeaders({ 'X-CSRF-TOKEN': newCSRFToken })
    // error.config.headers['X-CSRF-TOKEN'] = newCSRFToken

    if (error.config?.availableRetries === 0) {
      return Promise.reject(error)
    }

    if (!error.config.availableRetries) {
      error.config.availableRetries = AXIOS_REQUEST_RETRIES
    }

    error.config.availableRetries--

    return instance(error.config)
  }
)

export default instance
