import axios from 'axios'
import axiosRetry from 'axios-retry'

// Apply axios-retry to axios
axiosRetry(axios, {
  retries: 3,
  // Exponential back-off retry delay between requests
  retryDelay: axiosRetry.exponentialDelay,
})

export default axios
