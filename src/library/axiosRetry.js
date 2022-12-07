import axios from 'axios'
import axiosRetry from 'axios-retry'

const axiosInstance = axios.create()

// Apply axios-retry to axios
axiosRetry(axiosInstance, {
  retries: 3,
  // Exponential back-off retry delay between requests
  retryDelay: axiosRetry.exponentialDelay,
})

export default axiosInstance
