/**
 * OpenAI Service for generating AI suggestions
 * Includes retry logic, timeout handling, and error management
 */

const API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const API_URL = import.meta.env.VITE_OPENAI_API_URL
const MODEL = import.meta.env.VITE_OPENAI_MODEL

// Simple rate limiting to prevent too many requests
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 2000 // 2 seconds between requests

// Safety limits to prevent runaway token billing
const MAX_PROMPT_LENGTH = 4000 // Maximum characters in prompt
const MAX_TOKENS = 300 // Maximum tokens to generate

// Error types for better error handling
export class OpenAIError extends Error {
  constructor(message, type = 'UNKNOWN') {
    super(message)
    this.name = 'OpenAIError'
    this.type = type
  }
}

export class NetworkError extends OpenAIError {
  constructor(message) {
    super(message, 'NETWORK')
  }
}

export class TimeoutError extends OpenAIError {
  constructor(message) {
    super(message, 'TIMEOUT')
  }
}

export class APIError extends OpenAIError {
  constructor(message, status) {
    super(message, 'API')
    this.status = status
  }
}

/**
 * Sleep utility for retry delays
 */
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Generate text using OpenAI API with retry logic and timeout
 * @param {string} prompt - The prompt to send to OpenAI
 * @param {Object} options - Configuration options
 * @param {AbortSignal} options.signal - Abort signal for cancellation
 * @param {number} options.timeout - Request timeout in milliseconds (default: 30000)
 * @param {number} options.maxRetries - Maximum number of retries (default: 2)
 * @param {string} options.language - Language for AI response ('en' or 'ar')
 * @returns {Promise<string>} Generated text suggestion
 */
export const generateText = async (
  prompt,
  { signal, timeout = 30000, maxRetries = 2, language = 'en' } = {},
) => {
  if (!API_KEY || API_KEY === 'your_openai_api_key_here') {
    throw new APIError(
      'OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your .env file.',
      401,
    )
  }

  if (!prompt || prompt.trim().length === 0) {
    throw new APIError('Prompt cannot be empty', 400)
  }

  // Safety check: prevent runaway token billing
  if (prompt.length > MAX_PROMPT_LENGTH) {
    throw new APIError(
      `Prompt too long. Maximum ${MAX_PROMPT_LENGTH} characters allowed. Current: ${prompt.length}`,
      400,
    )
  }

  // Rate limiting: ensure minimum interval between requests
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest
    await sleep(waitTime)
  }
  lastRequestTime = Date.now()

  // Create abort controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  // Combine user abort signal with timeout signal
  if (signal) {
    signal.addEventListener('abort', () => controller.abort())
  }

  // Cleanup function to clear timeout
  const cleanup = () => {
    clearTimeout(timeoutId)
  }

  let lastError

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: 'system',
              content:
                language === 'ar'
                  ? 'أنت مساعد يكتب بيانات واضحة بصيغة المتكلم لطلبات الدعم الاجتماعي. اجعل الردود مركزة ومتعاطفة وواقعية. أعد النص النهائي فقط، بدون اقتباسات أو عناوين أو تفسيرات. اجعل الردود أقل من 200 كلمة ومتعاطفة ولكن واقعية.'
                  : 'You are an assistant that writes clear, first-person statements for social support applications. Keep responses focused, empathetic, and factual. Return ONLY the final text, no quotes, no headings, no explanation. Keep responses under 200 words and be empathetic but factual.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: MAX_TOKENS,
          temperature: 0.7,
        }),
        signal: controller.signal,
      })

      cleanup()

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage =
          errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`

        if (response.status === 401) {
          throw new APIError('Invalid API key. Please check your OpenAI API key.', 401)
        } else if (response.status === 429) {
          // Handle rate limiting with retry logic
          const retryAfter = response.headers.get('retry-after')
          const retryDelay = retryAfter
            ? parseInt(retryAfter) * 1000
            : Math.min(1000 * Math.pow(2, attempt), 30000)

          if (attempt < maxRetries) {
            // Wait before retrying
            await sleep(retryDelay)
            continue
          } else {
            throw new APIError(
              `Rate limit exceeded. Please wait ${Math.ceil(retryDelay / 1000)} seconds before trying again.`,
              429,
            )
          }
        } else if (response.status === 402) {
          // Handle quota exceeded error
          throw new APIError(
            'API quota exceeded. Please check your OpenAI billing and usage limits. You may need to upgrade your plan or wait for your quota to reset.',
            402,
          )
        } else if (response.status >= 500) {
          throw new APIError(`Server error: ${errorMessage}`, response.status)
        } else {
          throw new APIError(`API error: ${errorMessage}`, response.status)
        }
      }

      const data = await response.json()

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new APIError('Invalid response format from OpenAI API', 500)
      }

      const suggestion = data.choices[0].message.content.trim()

      if (!suggestion) {
        throw new APIError('Empty response from OpenAI API', 500)
      }

      return suggestion
    } catch (error) {
      lastError = error

      // Don't retry on certain errors
      if (error instanceof APIError && (error.status === 401 || error.status === 400)) {
        throw error
      }

      // Don't retry on abort (timeout or user cancellation)
      if (error.name === 'AbortError') {
        cleanup() // Ensure cleanup on abort
        if (controller.signal.aborted && !signal?.aborted) {
          throw new TimeoutError(`Request timed out after ${timeout}ms`)
        }
        throw error
      }

      // Don't retry on network errors if it's the last attempt
      if (error instanceof NetworkError && attempt === maxRetries) {
        throw error
      }

      // If this is the last attempt, throw the error
      if (attempt === maxRetries) {
        cleanup() // Ensure cleanup on final attempt
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          throw new NetworkError('Network error. Please check your internet connection.')
        }
        throw error
      }

      // Wait before retrying with exponential backoff
      const delay = Math.min(500 * Math.pow(2, attempt), 2000) // Cap at 2 seconds
      await sleep(delay)
    }
  }

  // Final cleanup before throwing error
  cleanup()
  throw lastError || new OpenAIError('Unknown error occurred')
}

/**
 * Check if the API key is configured
 * @returns {boolean} True if API key is configured
 */
export const isConfigured = () => {
  return !!(API_KEY && API_KEY !== 'your_openai_api_key_here')
}

/**
 * Get a user-friendly error message
 * @param {Error} error - The error object
 * @returns {string} User-friendly error message
 */
export const getErrorMessage = error => {
  if (error instanceof APIError) {
    if (error.status === 401) {
      return 'Invalid API key. Please check your OpenAI configuration.'
    }
    if (error.status === 402) {
      return 'API quota exceeded. Please check your OpenAI billing and usage limits. You may need to upgrade your plan or wait for your quota to reset.'
    }
    if (error.status === 429) {
      return error.message.includes('wait')
        ? error.message
        : 'Rate limit exceeded. Please wait a moment and try again.'
    }
    if (error.status >= 500) {
      return 'Service temporarily unavailable. Please try again later.'
    }
    return error.message
  }

  if (error instanceof NetworkError) {
    return 'Network error. Please check your internet connection.'
  }

  if (error instanceof TimeoutError) {
    return 'Request timed out. Please try again.'
  }

  if (error.name === 'AbortError') {
    return 'Request was cancelled.'
  }

  return 'An unexpected error occurred. Please try again.'
}
