"use client"

import { useState, useEffect } from "react"
import { X, Sun, Wind, Flower, TrendingUp, Droplets, Zap, Leaf, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { fetchEnvironmentalData } from "@/lib/api"
import { calculateFutureProofScore } from "@/lib/scoring"
import { calculateRoofAnalysis } from "@/lib/polygon-analysis"

export function DetailPanel({ location, polygon, onClose }) {
  const [loading, setLoading] = useState(true)
  const [environmentalData, setEnvironmentalData] = useState(null)
  const [futureProofScore, setFutureProofScore] = useState(null)
  const [roofAnalysis, setRoofAnalysis] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Determine coordinates based on location or polygon
        let coordinates
        if (polygon) {
          coordinates = polygon.center
        } else if (location) {
          coordinates = location.coordinates
        } else {
          throw new Error("No location data available")
        }

        const data = await fetchEnvironmentalData(coordinates)
        setEnvironmentalData(data)

        const score = calculateFutureProofScore(data)
        setFutureProofScore(score)

        // Calculate roof analysis if polygon exists
        if (polygon) {
          const analysis = calculateRoofAnalysis(polygon, data)
          setRoofAnalysis(analysis)
        }
      } catch (err) {
        setError("Failed to load environmental data")
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }

    if (location || polygon) {
      loadData()
    }
  }, [location, polygon])

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200"
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    if (score >= 40) return "text-orange-600 bg-orange-50 border-orange-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Poor"
  }

  const getAQICategory = (aqi) => {
    if (aqi <= 50) return { label: "Good", color: "text-green-600" }
    if (aqi <= 100) return { label: "Moderate", color: "text-yellow-600" }
    if (aqi <= 150) return { label: "Unhealthy for Sensitive Groups", color: "text-orange-600" }
    return { label: "Unhealthy", color: "text-red-600" }
  }

  const getPollenSummary = (pollenData) => {
    if (!pollenData || !pollenData.dailyInfo || pollenData.dailyInfo.length === 0) {
      return "No data available"
    }

    const today = pollenData.dailyInfo[0]
    const pollenTypes = today.pollenTypeInfo || []

    const highPollenTypes = pollenTypes.filter((pollen) => pollen.indexInfo && pollen.indexInfo.value >= 3)

    if (highPollenTypes.length === 0) {
      return "Low pollen levels"
    }

    const typeNames = highPollenTypes.map((pollen) => pollen.code.replace("_", " ").toLowerCase()).join(", ")

    return `High: ${typeNames}`
  }

  const formatNumber = (num) => {
    if (num === null || num === undefined || isNaN(num)) return "0"
    return new Intl.NumberFormat("en-US").format(Math.round(num))
  }

  const formatCurrency = (num) => {
    if (num === null || num === undefined || isNaN(num)) return "$0.00"
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num)
  }

  const formatPercentage = (num) => {
    if (num === null || num === undefined || isNaN(num)) return "0%"
    return `${Math.min(100, Math.max(0, Math.round(num)))}%`
  }

  return (
    <div className="absolute top-4 right-4 w-[420px] max-h-[calc(100vh-2rem)] font-['Urbanist',sans-serif] z-20">
      <Card className="shadow-2xl border-2 border-green-100 bg-white backdrop-blur-md">
        <CardHeader className="pb-4 bg-white border-b border-green-100">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold font-['Urbanist',sans-serif] text-green-700">
              {polygon
                ? "🏠 Roof Analysis"
                : location?.type === "property"
                  ? "🏡 Property Analysis"
                  : "📍 Location Analysis"}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-10 w-10 hover:bg-red-100 rounded-full"
              title="Close panel"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {location?.type === "property" && (
            <div className="space-y-2 mt-3">
              <p className="text-base text-gray-700 font-['Urbanist',sans-serif] font-medium">
                {location.data.address}
              </p>
              <p className="text-xl font-bold text-green-600 font-['Urbanist',sans-serif]">{location.data.price}</p>
            </div>
          )}

          <p className="text-sm text-gray-600 font-['Urbanist',sans-serif] mt-2">
            📍 {location?.coordinates?.lat.toFixed(6) || polygon?.center?.lat.toFixed(6)},{" "}
            {location?.coordinates?.lng.toFixed(6) || polygon?.center?.lng.toFixed(6)}
          </p>
        </CardHeader>

        <ScrollArea className="h-[calc(100vh-12rem)]">
          <CardContent className="space-y-6 p-6 bg-white">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                <span className="ml-4 text-base text-gray-600 font-['Urbanist',sans-serif] font-medium">
                  Calculating comprehensive analysis...
                </span>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <p className="text-base text-red-600 font-['Urbanist',sans-serif] font-medium">{error}</p>
              </div>
            )}

            {!loading && !error && futureProofScore && environmentalData && (
              <>
                {/* Future-Proof Score */}
                <div className="text-center">
                  <div
                    className={`inline-flex items-center px-6 py-4 rounded-2xl border-2 ${getScoreColor(futureProofScore.total)}`}
                  >
                    <TrendingUp className="h-6 w-6 mr-3" />
                    <span className="text-3xl font-bold font-['Urbanist',sans-serif]">{futureProofScore.total}</span>
                    <span className="text-lg ml-2 font-['Urbanist',sans-serif]">/100</span>
                  </div>
                  <p className="text-base text-gray-700 mt-3 font-['Urbanist',sans-serif] font-medium">
                    {getScoreLabel(futureProofScore.total)} Future-Proof Score
                  </p>
                </div>

                <Separator className="bg-green-200" />

                {/* Environmental Data */}
                <div className="space-y-4">
                  <h4 className="font-bold text-lg font-['Urbanist',sans-serif] text-green-700 flex items-center">
                    <Leaf className="h-5 w-5 mr-2" />
                    Environmental Analysis
                  </h4>

                  {/* Solar Data */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                    <div className="flex items-center">
                      <Sun className="h-6 w-6 text-yellow-600 mr-3" />
                      <span className="text-base font-semibold font-['Urbanist',sans-serif]">Solar Potential</span>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold text-green-600 font-['Urbanist',sans-serif]">
                        {formatCurrency(environmentalData.solar?.monthlySavings || 0)}/month
                      </p>
                      <p className="text-sm text-gray-600 font-['Urbanist',sans-serif]">Est. savings</p>
                    </div>
                  </div>

                  {/* Air Quality */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <div className="flex items-center">
                      <Wind className="h-6 w-6 text-blue-600 mr-3" />
                      <span className="text-base font-semibold font-['Urbanist',sans-serif]">Air Quality</span>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold font-['Urbanist',sans-serif]">
                        AQI {environmentalData.airQuality?.aqi || "N/A"}
                      </p>
                      <p
                        className={`text-sm ${getAQICategory(environmentalData.airQuality?.aqi || 0).color} font-['Urbanist',sans-serif] font-medium`}
                      >
                        {getAQICategory(environmentalData.airQuality?.aqi || 0).label}
                      </p>
                    </div>
                  </div>

                  {/* Pollen */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex items-center">
                      <Flower className="h-6 w-6 text-green-600 mr-3" />
                      <span className="text-base font-semibold font-['Urbanist',sans-serif]">Pollen Levels</span>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-bold font-['Urbanist',sans-serif]">
                        {getPollenSummary(environmentalData.pollen)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Roof Analysis Section */}
                {roofAnalysis && (
                  <>
                    <Separator className="bg-green-200" />
                    <div className="space-y-4">
                      <h4 className="font-bold text-lg font-['Urbanist',sans-serif] text-green-700 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Comprehensive Roof Analysis
                      </h4>

                      {/* Roof Area */}
                      <div className="bg-white border-2 border-green-200 rounded-xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <TrendingUp className="h-6 w-6 text-green-600 mr-3" />
                            <span className="text-base font-semibold font-['Urbanist',sans-serif]">Roof Area</span>
                          </div>
                          <div className="text-right">
                            <p className="text-base font-bold font-['Urbanist',sans-serif]">
                              {formatNumber(roofAnalysis.roofArea?.squareFeet)} sq ft
                            </p>
                            <p className="text-sm text-gray-600 font-['Urbanist',sans-serif]">
                              ({formatNumber(roofAnalysis.roofArea?.squareMeters)} m²)
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Rainwater Collection */}
                      <div className="bg-white border-2 border-blue-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Droplets className="h-6 w-6 text-blue-600 mr-3" />
                            <span className="text-base font-semibold font-['Urbanist',sans-serif]">
                              Rainwater Harvesting
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 font-['Urbanist',sans-serif]">Monthly Collection</p>
                            <p className="font-bold text-blue-600 font-['Urbanist',sans-serif]">
                              {formatNumber(roofAnalysis.rainwater?.monthlyGallons)} gallons
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-['Urbanist',sans-serif]">Monthly Savings</p>
                            <p className="font-bold text-green-600 font-['Urbanist',sans-serif]">
                              {formatCurrency(roofAnalysis.rainwater?.monthlySavings)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-['Urbanist',sans-serif]">Annual Collection</p>
                            <p className="font-bold text-blue-600 font-['Urbanist',sans-serif]">
                              {formatNumber(roofAnalysis.rainwater?.annualGallons)} gallons
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-['Urbanist',sans-serif]">Annual Savings</p>
                            <p className="font-bold text-green-600 font-['Urbanist',sans-serif]">
                              {formatCurrency(roofAnalysis.rainwater?.annualSavings)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Solar Analysis */}
                      <div className="bg-white border-2 border-yellow-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Sun className="h-6 w-6 text-yellow-600 mr-3" />
                            <span className="text-base font-semibold font-['Urbanist',sans-serif]">
                              Solar Energy System
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 font-['Urbanist',sans-serif]">System Capacity</p>
                            <p className="font-bold text-yellow-600 font-['Urbanist',sans-serif]">
                              {roofAnalysis.solar?.capacityKW || 0} kW
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-['Urbanist',sans-serif]">Monthly Savings</p>
                            <p className="font-bold text-green-600 font-['Urbanist',sans-serif]">
                              {formatCurrency(roofAnalysis.solar?.monthlySavings)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-['Urbanist',sans-serif]">Annual Production</p>
                            <p className="font-bold text-yellow-600 font-['Urbanist',sans-serif]">
                              {formatNumber((roofAnalysis.solar?.capacityKW || 0) * 1200)} kWh
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 font-['Urbanist',sans-serif]">Annual Savings</p>
                            <p className="font-bold text-green-600 font-['Urbanist',sans-serif]">
                              {formatCurrency(roofAnalysis.solar?.annualSavings)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Combined Impact */}
                      <div className="bg-white border-2 border-green-300 rounded-xl p-6">
                        <h5 className="font-bold text-lg text-green-700 mb-4 font-['Urbanist',sans-serif] flex items-center">
                          <Leaf className="h-6 w-6 mr-2" />
                          Combined Environmental Impact
                        </h5>
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                              <span className="font-semibold font-['Urbanist',sans-serif]">Total Monthly Savings</span>
                            </div>
                            <span className="text-xl font-bold text-green-600 font-['Urbanist',sans-serif]">
                              {formatCurrency(roofAnalysis.financial?.totalMonthlySavings)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Zap className="h-5 w-5 text-green-600 mr-2" />
                              <span className="font-semibold font-['Urbanist',sans-serif]">
                                Annual Energy Independence
                              </span>
                            </div>
                            <span className="text-lg font-bold text-green-600 font-['Urbanist',sans-serif]">
                              {formatPercentage((((roofAnalysis.solar?.capacityKW || 0) * 1200) / 12000) * 100)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Leaf className="h-5 w-5 text-green-600 mr-2" />
                              <span className="font-semibold font-['Urbanist',sans-serif]">CO₂ Reduction (Annual)</span>
                            </div>
                            <span className="text-lg font-bold text-green-600 font-['Urbanist',sans-serif]">
                              {formatNumber(roofAnalysis.environmental?.annualCarbonReduction)} tons
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                              <span className="font-semibold font-['Urbanist',sans-serif]">25-Year ROI</span>
                            </div>
                            <span className="text-lg font-bold text-green-600 font-['Urbanist',sans-serif]">
                              {formatCurrency(roofAnalysis.financial?.twentyFiveYearSavings)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <Separator className="bg-green-200" />

                {/* Score Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-bold text-base font-['Urbanist',sans-serif] text-green-700">Score Breakdown</h4>
                  <div className="space-y-2 text-sm font-['Urbanist',sans-serif]">
                    <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg">
                      <span className="font-medium">Solar Score (40%)</span>
                      <span className="font-bold text-yellow-600">{futureProofScore.solar}/100</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                      <span className="font-medium">Air Quality Score (40%)</span>
                      <span className="font-bold text-blue-600">{futureProofScore.airQuality}/100</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                      <span className="font-medium">Pollen Score (20%)</span>
                      <span className="font-bold text-green-600">{futureProofScore.pollen}/100</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </ScrollArea>
      </Card>
    </div>
  )
}
