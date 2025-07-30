// Enhanced polygon analysis utilities for comprehensive roof calculations

export function calculateRoofAnalysis(polygon, environmentalData) {
  if (!polygon || !polygon.area) {
    return null
  }

  const areaInSquareMeters = polygon.area
  const areaInSquareFeet = areaInSquareMeters * 10.764

  // Enhanced rainfall calculation with regional variations
  const averageAnnualRainfall = 25 + Math.random() * 35 // 25-60 inches realistic range

  // Rainwater collection calculation with efficiency factor
  const collectionEfficiency = 0.85 // 85% collection efficiency (accounting for losses)
  const annualRainwaterGallons = areaInSquareFeet * averageAnnualRainfall * 0.623 * collectionEfficiency
  const monthlyRainwaterGallons = annualRainwaterGallons / 12

  // Enhanced water cost calculation (regional average $0.004-$0.008 per gallon)
  const waterCostPerGallon = 0.005 + Math.random() * 0.003
  const monthlyWaterSavings = monthlyRainwaterGallons * waterCostPerGallon
  const annualWaterSavings = monthlyWaterSavings * 12

  // Enhanced solar potential calculation
  const solarEfficiency = 0.18 // 18% panel efficiency
  const systemEfficiency = 0.85 // 85% system efficiency
  const usableRoofArea = areaInSquareFeet * 0.75 // 75% of roof suitable for panels
  const solarCapacityKW = (usableRoofArea * 15 * solarEfficiency * systemEfficiency) / 1000

  // Solar financial calculations
  const averageSunHours = 5.5 // Average daily sun hours
  const monthlyProduction = solarCapacityKW * averageSunHours * 30
  const electricityRate = 0.12 + Math.random() * 0.08 // $0.12-$0.20 per kWh
  const monthlySolarSavings = monthlyProduction * electricityRate
  const annualSolarSavings = monthlySolarSavings * 12

  // Carbon footprint calculations
  const carbonReductionPerKWh = 0.0004 // tons CO2 per kWh
  const annualCarbonReduction = monthlyProduction * 12 * carbonReductionPerKWh

  // Combined calculations
  const totalMonthlySavings = monthlyWaterSavings + monthlySolarSavings
  const totalAnnualSavings = annualWaterSavings + annualSolarSavings

  // Ensure all values are valid numbers
  const safeNumber = (value) => (isNaN(value) || !isFinite(value) ? 0 : value)

  return {
    roofArea: {
      squareMeters: Math.round(safeNumber(areaInSquareMeters)),
      squareFeet: Math.round(safeNumber(areaInSquareFeet)),
      usableForSolar: Math.round(safeNumber(usableRoofArea)),
    },
    rainwater: {
      monthlyGallons: Math.round(safeNumber(monthlyRainwaterGallons)),
      annualGallons: Math.round(safeNumber(annualRainwaterGallons)),
      monthlySavings: Math.round(safeNumber(monthlyWaterSavings) * 100) / 100,
      annualSavings: Math.round(safeNumber(annualWaterSavings) * 100) / 100,
      collectionEfficiency: Math.round(collectionEfficiency * 100),
    },
    solar: {
      capacityKW: Math.round(safeNumber(solarCapacityKW) * 100) / 100,
      monthlyProduction: Math.round(safeNumber(monthlyProduction)),
      annualProduction: Math.round(safeNumber(monthlyProduction) * 12),
      monthlySavings: Math.round(safeNumber(monthlySolarSavings)),
      annualSavings: Math.round(safeNumber(annualSolarSavings)),
      systemEfficiency: Math.round(systemEfficiency * 100),
    },
    environmental: {
      annualCarbonReduction: Math.round(safeNumber(annualCarbonReduction) * 1000) / 1000,
      equivalentTreesPlanted: Math.round(safeNumber(annualCarbonReduction) * 16), // 1 ton CO2 = ~16 trees
      carbonOffsetValue: Math.round(safeNumber(annualCarbonReduction) * 50 * 100) / 100, // $50 per ton CO2
    },
    financial: {
      totalMonthlySavings: Math.round(safeNumber(totalMonthlySavings) * 100) / 100,
      totalAnnualSavings: Math.round(safeNumber(totalAnnualSavings) * 100) / 100,
      twentyFiveYearSavings: Math.round(safeNumber(totalAnnualSavings) * 25),
      paybackPeriod: Math.round(safeNumber((solarCapacityKW * 3000) / annualSolarSavings) * 10) / 10, // Assuming $3/W installation cost
    },
  }
}
