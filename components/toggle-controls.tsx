"use client"

import { Button } from "@/components/ui/button"
import { Navigation, Satellite, Map, Pencil, X } from "lucide-react"

interface ToggleControlsProps {
  onGeolocation: () => void
  onMapTypeChange: (type: string) => void
  onDrawingToggle: (enabled: boolean) => void
  mapType: string
  isDrawingMode: boolean
}

export function ToggleControls({
  onGeolocation,
  onMapTypeChange,
  onDrawingToggle,
  mapType,
  isDrawingMode,
}: ToggleControlsProps) {
  return (
    <div className="absolute top-4 right-4 flex flex-col gap-3 z-10">
      {/* Geolocation Button */}
      <Button
        onClick={onGeolocation}
        size="lg"
        variant="outline"
        className="bg-white backdrop-blur-sm hover:bg-green-50 border-2 border-green-200 text-green-700 font-['Urbanist',sans-serif] font-semibold shadow-xl hover:shadow-2xl transition-all duration-200 px-6 py-3"
        title="Find my current location"
      >
        <Navigation className="h-5 w-5 mr-2" />
        My Location
      </Button>

      {/* Map Type Toggle */}
      <div className="flex gap-2">
        <Button
          onClick={() => onMapTypeChange("roadmap")}
          size="lg"
          variant={mapType === "roadmap" ? "default" : "outline"}
          className={`${
            mapType === "roadmap"
              ? "bg-green-600 hover:bg-green-700 text-white shadow-xl"
              : "bg-white backdrop-blur-sm hover:bg-green-50 border-2 border-green-200 text-green-700 shadow-xl"
          } font-['Urbanist',sans-serif] font-semibold transition-all duration-200 px-4 py-3`}
          title="Switch to road map view"
        >
          <Map className="h-5 w-5" />
        </Button>
        <Button
          onClick={() => onMapTypeChange("satellite")}
          size="lg"
          variant={mapType === "satellite" ? "default" : "outline"}
          className={`${
            mapType === "satellite"
              ? "bg-green-600 hover:bg-green-700 text-white shadow-xl"
              : "bg-white backdrop-blur-sm hover:bg-green-50 border-2 border-green-200 text-green-700 shadow-xl"
          } font-['Urbanist',sans-serif] font-semibold transition-all duration-200 px-4 py-3`}
          title="Switch to satellite view"
        >
          <Satellite className="h-5 w-5" />
        </Button>
      </div>

      {/* Drawing Mode Toggle */}
      <Button
        onClick={() => onDrawingToggle(!isDrawingMode)}
        size="lg"
        variant={isDrawingMode ? "default" : "outline"}
        className={`${
          isDrawingMode
            ? "bg-red-600 hover:bg-red-700 text-white shadow-xl animate-pulse"
            : "bg-white backdrop-blur-sm hover:bg-green-50 border-2 border-green-200 text-green-700 shadow-xl"
        } font-['Urbanist',sans-serif] font-semibold transition-all duration-200 px-6 py-3`}
        title={isDrawingMode ? "Exit drawing mode (click to stop)" : "Start drawing roof polygons"}
      >
        {isDrawingMode ? (
          <>
            <X className="h-5 w-5 mr-2" />
            Stop Drawing
          </>
        ) : (
          <>
            <Pencil className="h-5 w-5 mr-2" />
            Draw Roof Area
          </>
        )}
      </Button>

      {/* Drawing Instructions */}
      {isDrawingMode && (
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 max-w-xs">
          <p className="text-sm font-semibold text-red-700 font-['Urbanist',sans-serif] mb-1">Drawing Mode Active</p>
          <p className="text-xs text-red-600 font-['Urbanist',sans-serif]">
            Click on the map to start drawing a polygon around the roof area. Click "Stop Drawing" when finished.
          </p>
        </div>
      )}
    </div>
  )
}
