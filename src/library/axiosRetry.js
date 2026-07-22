import axios, { isCancel } from 'axios'
import axiosRetry, { exponentialDelay } from 'axios-retry'

const axiosInstance = axios.create()

// Apply axios-retry to axios
axiosRetry(axiosInstance, {
  retries: 3,
  // Exponential back-off retry delay between requests
  retryDelay: exponentialDelay,
  retryCondition: (error) => !isCancel(error), // retry no matter what (POSTs can also be idempotent in MERMAID), but never retry cancelled requests
})

export default axiosInstance
