import axios from 'axios'
import axiosRetry, { exponentialDelay } from 'axios-retry'

const axiosInstance = axios.create()

// Apply axios-retry to axios
axiosRetry(axiosInstance, {
  retries: 3,
  // Exponential back-off retry delay between requests
  retryDelay: exponentialDelay,
  retryCondition: (_error) => true, // retry no matter what (POSTs can also be idempotent in MERMAID)
})

export default axiosInstance
