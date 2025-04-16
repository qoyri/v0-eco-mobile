export async function testConnection() {
  const start = Date.now()
  // Simulate a database connection test
  await new Promise((resolve) => setTimeout(resolve, 200))
  const end = Date.now()
  return {
    time: end - start,
  }
}
