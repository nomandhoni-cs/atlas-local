export function calculateFutureProofScore(environmentalData) {
  const { solar, airQuality, pollen } = environmentalData

  // Solar Score (40% weight)
  // $0 savings = 0 points, $500+ savings = 100 points
  const solarSavings = solar?.monthlySavings || 0
  const solarScore = Math.min(100, Math.max(0, (solarSavings / 500) * 100))

  // Air Quality Score (40% weight)
  // AQI 0 = 100 points, AQI 150+ = 0 points (lower AQI is better)
  const aqi = airQuality?.aqi || 0
  const airQualityScore = Math.min(100, Math.max(0, 100 - (aqi / 150) * 100))

  // Pollen Score (20% weight)
  // Binary score: if any pollen type has index >= 3, score is 20, otherwise 100
  let pollenScore = 100
  if (pollen?.dailyInfo && pollen.dailyInfo.length > 0) {
    const todayPollen = pollen.dailyInfo[0]
    if (todayPollen.pollenTypeInfo) {
      const hasHighPollen = todayPollen.pollenTypeInfo.some(
        (pollenType) => pollenType.indexInfo && pollenType.indexInfo.value >= 3,
      )
      pollenScore = hasHighPollen ? 20 : 100
    }
  }

  // Calculate weighted average
  const totalScore = Math.round(solarScore * 0.4 + airQualityScore * 0.4 + pollenScore * 0.2)

  return {
    total: totalScore,
    solar: Math.round(solarScore),
    airQuality: Math.round(airQualityScore),
    pollen: Math.round(pollenScore),
  }
}
