export async function fetchEnvironmentalData(coordinates) {
  const { lat, lng } = coordinates

  try {
    const response = await fetch("/api/environmental-data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lat, lng }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`)
    }

    const data = await response.json()
    console.log(data);
    return data
  } catch (error) {
    console.error("Error fetching environmental data:", error)
    throw new Error("Failed to fetch environmental data")
  }
}