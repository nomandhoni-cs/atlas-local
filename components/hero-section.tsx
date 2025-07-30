"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Leaf, Sun, Droplets, TrendingUp, Zap } from "lucide-react"

interface HeroSectionProps {
  onDiscoverClick: () => void
}

export function HeroSection({ onDiscoverClick }: HeroSectionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 font-['Urbanist',sans-serif]">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-600 p-3 rounded-xl shadow-lg">
              <MapPin className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-green-600">Atlas Local</h1>
              <p className="text-base text-gray-700 font-medium">Charting our shared future.</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Discover Your Property's
            <span className="text-green-600 block mt-2">Sustainable Future</span>
          </h2>

          <p className="text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Analyze environmental data, calculate solar savings, assess rainwater collection potential, and make
            informed decisions about your property's sustainable future with comprehensive carbon impact analysis.
          </p>

          <Button
            onClick={onDiscoverClick}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            <MapPin className="mr-3 h-6 w-6" />
            Explore the Interactive Map
          </Button>

          <div className="mt-8 text-gray-600 text-lg">
            <p>✨ Free analysis • 🌍 Real environmental data • 💡 Actionable insights</p>
          </div>
        </div>

        {/* Enhanced Features Grid with Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-20 max-w-6xl mx-auto">
          <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Sun className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Solar Energy Analysis</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Calculate potential solar energy generation, monthly savings, and electricity production for any
                location or roof area with precise financial projections.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="bg-gradient-to-br from-blue-400 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Droplets className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Rainwater Harvesting</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Estimate rainwater collection potential in gallons, cost savings, and environmental impact based on roof
                area and local precipitation data.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="bg-gradient-to-br from-green-400 to-emerald-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Carbon Impact Score</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Get comprehensive environmental analysis including air quality, carbon emissions reduction, and
                sustainability metrics with actionable insights.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* New Features Row */}
        <div className="grid md:grid-cols-2 gap-10 mt-12 max-w-4xl mx-auto">
          <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="bg-gradient-to-br from-purple-400 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Financial Projections</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Detailed cost-benefit analysis with ROI calculations, payback periods, and long-term financial
                projections for sustainable investments.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="bg-gradient-to-br from-indigo-400 to-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Energy Efficiency</h3>
              <p className="text-gray-700 text-lg leading-relaxed">
                Comprehensive energy analysis including consumption patterns, efficiency recommendations, and potential
                energy independence calculations.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced CTA Section */}
        <Card className="mt-20 border-0 bg-white/90 backdrop-blur-sm shadow-2xl">
          <CardContent className="text-center p-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Ready to Transform Your Property?</h3>
            <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
              Join thousands of property owners making data-driven decisions for a sustainable future.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-lg">
              <div className="flex items-center text-gray-600 bg-green-50 px-6 py-3 rounded-full border border-green-200">
                <MapPin className="h-5 w-5 mr-2 text-green-600" />
                <span className="font-medium">Click properties or explore anywhere</span>
              </div>
              <div className="flex items-center text-gray-600 bg-green-50 px-6 py-3 rounded-full border border-green-200">
                <Sun className="h-5 w-5 mr-2 text-green-600" />
                <span className="font-medium">Draw polygons for roof analysis</span>
              </div>
              <div className="flex items-center text-gray-600 bg-green-50 px-6 py-3 rounded-full border border-green-200">
                <Droplets className="h-5 w-5 mr-2 text-green-600" />
                <span className="font-medium">Calculate comprehensive savings</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
