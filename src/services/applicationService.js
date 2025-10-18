export const submitApplication = async formData => {
  // Fake submission delay for mock API testing
  return new Promise(resolve => {
    setTimeout(() => {
      // For development/testing, always succeed
      // In production, you might want to add back the random failure simulation
      console.log('Mock API: Application submitted successfully', formData)
      resolve({ status: 200, message: 'Application submitted successfully' })

      // Uncomment the lines below if you want to test error handling:
      // if (Math.random() < 0.9) {
      //   console.log('Mock API: Application submitted successfully', formData)
      //   resolve({ status: 200, message: 'Application submitted successfully' })
      // } else {
      //   console.log('Mock API: Server error simulation')
      //   reject(new Error('Server error, please try again'))
      // }
    }, 1200)
  })
}
