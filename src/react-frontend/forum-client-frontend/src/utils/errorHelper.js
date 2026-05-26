export const getErrorMessage = (error) => {
  // 1. Check if the backend sent a structured response
  if (error?.response?.data) {
    const errorData = error.response.data

    // 2. Check for validation field errors
    if (errorData.fieldErrors && Object.keys(errorData.fieldErrors).length > 0) {
      const allMessages = Object.values(errorData.fieldErrors)
      return allMessages[0] // Return the very first validation message
    }

    // 3. Fallback to global message or standard default
    return errorData.message || 'An unexpected server error occurred.'
  }

  // 4. Fallback if the server is completely down (no error.response)
  return error?.message || 'Unable to connect to the server. Please check your network.'
}
