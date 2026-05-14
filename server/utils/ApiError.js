/**
 * Custom error class for API responses.
 * Throw this inside any asyncHandler-wrapped route to send
 * a structured error response with the correct HTTP status.
 *
 * Usage:
 *   throw new ApiError(404, 'Resume not found');
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

module.exports = ApiError;
