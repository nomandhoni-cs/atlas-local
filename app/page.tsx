"use client"

import { useState, useCallback, useRef } from "react"
import { GoogleMap, LoadScript, Marker, Polygon, DrawingManager } from "@react-google-maps/api"
import { properties } from "@/data/properties"
import { DetailPanel } from "@/components/detail-panel"
import { SearchBar } from "@/components/search-bar"
import { ToggleControls } from "@/components/toggle-controls"
import { HeroSection } from "@/components/hero-section"

const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
}

const center = {
  lat: 37.7749,
  lng: -122.4194,
}

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
}

const libraries = ["drawing", "places", "geometry"]

// Enhanced marker icons with better visibility
const propertyMarkerIcon = {
  path: "M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13C19,5.13 15.87,2 12,2zM12,11.5c-1.38,0 -2.5,-1.12 -2.5,-2.5s1.12,-2.5 2.5,-2.5s2.5,1.12 2.5,2.5S13.38,11.5 12,11.5z",
  fillColor: "#10B981",
  fillOpacity: 1,
  strokeColor: "#ffffff",
  strokeWeight: 3,
  scale: 2,
}

const explorationMarkerIcon = {
  path: "M12,2C8.13,2 5,5.13 5,9c0,5.25 7,13 7,13s7,-7.75 7,-13C19,5.13 15.87,2 12,2zM12,11.5c-1.38,0 -2.5,-1.12 -2.5,-2.5s1.12,-2.5 2.5,-2.5s2.5,1.12 2.5,2.5S13.38,11.5 12,11.5z",
  fillColor: "#059669",
  fillOpacity: 1,
  strokeColor: "#ffffff",
  strokeWeight: 3,
  scale: 2,
}

export default function PropertyFinder() {
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedPolygon, setSelectedPolygon] = useState(null)
  const [map, setMap] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showHero, setShowHero] = useState(true)
  const [mapType, setMapType] = useState("roadmap")
  const [isDrawingMode, setIsDrawingMode] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [polygons, setPolygons] = useState([])
  const drawingManagerRef = useRef(null)

  const onLoad = useCallback((map) => {
    setMap(map)
    setIsLoaded(true)
  }, [])

  const handlePropertyClick = (property) => {
    setSelectedLocation({
      type: "property",
      data: property,
      coordinates: { lat: property.lat, lng: property.lng },
    })
    setSelectedPolygon(null)
  }

  const handleMapDoubleClick = (event) => {
    if (isDrawingMode) return // Don't create markers in drawing mode

    const lat = event.latLng.lat()
    const lng = event.latLng.lng()

    setSelectedLocation({
      type: "exploration",
      coordinates: { lat, lng },
    })
    setSelectedPolygon(null)
  }

  const handlePolygonComplete = (polygon) => {
    try {
      const path = polygon.getPath()
      const coordinates = []

      for (let i = 0; i < path.getLength(); i++) {
        const point = path.getAt(i)
        coordinates.push({ lat: point.lat(), lng: point.lng() })
      }

      // Calculate area using Google Maps geometry library
      const area = window.google.maps.geometry.spherical.computeArea(path)

      // Get center point of polygon for location data
      const bounds = new window.google.maps.LatLngBounds()
      coordinates.forEach((coord) => bounds.extend(coord))
      const center = bounds.getCenter()

      const newPolygon = {
        id: Date.now(),
        coordinates,
        area,
        center: { lat: center.lat(), lng: center.lng() },
        type: "polygon",
      }

      setPolygons([...polygons, newPolygon])
      setSelectedPolygon(newPolygon)
      setSelectedLocation(null)

      // Remove the drawing polygon from map
      polygon.setMap(null)
    } catch (error) {
      console.error("Error processing polygon:", error)
    }
  }

  const handlePolygonClick = (polygon) => {
    setSelectedPolygon(polygon)
    setSelectedLocation(null)
  }

  const handleClosePanel = () => {
    setSelectedLocation(null)
    setSelectedPolygon(null)
  }

  const handleDiscoverClick = () => {
    setShowHero(false)
  }

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setUserLocation(location)
          if (map) {
            map.panTo(location)
            map.setZoom(15)
          }
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }

  const handleMapTypeToggle = (type) => {
    setMapType(type)
    if (map) {
      map.setMapTypeId(type)
    }
  }

  const handleDrawingToggle = (enabled) => {
    setIsDrawingMode(enabled)
  }

  const handleLocationSelect = (location) => {
    if (map) {
      map.panTo(location)
      map.setZoom(15)
    }
    setSelectedLocation({
      type: "exploration",
      coordinates: location,
    })
  }

  const handleLoadError = (error) => {
    console.error("Google Maps failed to load:", error)
  }

  if (showHero) {
    return <HeroSection onDiscoverClick={handleDiscoverClick} />
  }

  return (
    <div className="relative w-full h-screen font-['Urbanist',sans-serif]">
      <LoadScript
        googleMapsApiKey="AIzaSyDtXKDh9X7rTW5qdp4b169mYjs9oAZvxs0"
        libraries={libraries}
        onLoad={() => setIsLoaded(true)}
        onError={handleLoadError}
        loadingElement={
          <div className="flex items-center justify-center w-full h-screen bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600 font-['Urbanist',sans-serif] text-lg">Loading Atlas Local...</p>
            </div>
          </div>
        }
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          onLoad={onLoad}
          onDblClick={handleMapDoubleClick}
          options={{
            ...mapOptions,
            mapTypeId: mapType,
          }}
        >
          {/* Drawing Manager */}
          {isLoaded && isDrawingMode && (
            <DrawingManager
              ref={drawingManagerRef}
              onPolygonComplete={handlePolygonComplete}
              options={{
                drawingControl: true,
                drawingControlOptions: {
                  position: window.google.maps.ControlPosition.TOP_CENTER,
                  drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
                },
                polygonOptions: {
                  fillColor: "#10B981",
                  fillOpacity: 0.4,
                  strokeColor: "#059669",
                  strokeWeight: 3,
                  clickable: true,
                  editable: true,
                },
              }}
            />
          )}

          {/* Property Markers */}
          {isLoaded &&
            properties.map((property) => (
              <Marker
                key={property.id}
                position={{ lat: property.lat, lng: property.lng }}
                onClick={() => handlePropertyClick(property)}
                icon={propertyMarkerIcon}
                title={`${property.address} - ${property.price}`}
              />
            ))}

          {/* User Location Marker */}
          {isLoaded && userLocation && (
            <Marker
              position={userLocation}
              title="Your Location"
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: "#10B981",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 4,
                scale: 10,
              }}
            />
          )}

          {/* Exploration Marker */}
          {isLoaded && selectedLocation && selectedLocation.type === "exploration" && (
            <Marker position={selectedLocation.coordinates} icon={explorationMarkerIcon} title="Selected Location" />
          )}

          {/* Saved Polygons */}
          {isLoaded &&
            polygons.map((polygon) => (
              <Polygon
                key={polygon.id}
                paths={polygon.coordinates}
                onClick={() => handlePolygonClick(polygon)}
                options={{
                  fillColor: selectedPolygon?.id === polygon.id ? "#059669" : "#10B981",
                  fillOpacity: selectedPolygon?.id === polygon.id ? 0.6 : 0.4,
                  strokeColor: "#059669",
                  strokeWeight: 3,
                  clickable: true,
                }}
              />
            ))}
        </GoogleMap>
      </LoadScript>

      {/* Top Controls */}
      <ToggleControls
        onGeolocation={handleGeolocation}
        onMapTypeChange={handleMapTypeToggle}
        onDrawingToggle={handleDrawingToggle}
        mapType={mapType}
        isDrawingMode={isDrawingMode}
      />

      {/* Left Side Controls */}
      <div className="absolute top-4 left-4 space-y-4 z-10">
        {/* Brand Header */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-green-100">
          <h1 className="text-2xl font-bold text-green-600 font-['Urbanist',sans-serif]">Atlas Local</h1>
          <p className="text-base text-gray-700 font-['Urbanist',sans-serif] mt-1">Charting our shared future.</p>
        </div>

        {/* Instructions */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-2xl max-w-sm border border-green-100">
          <h3 className="font-bold text-base mb-3 text-green-600 font-['Urbanist',sans-serif]">How to use:</h3>
          <ul className="text-sm space-y-2 text-gray-700 font-['Urbanist',sans-serif] leading-relaxed">
            <li>
              • <strong>Click green markers</strong> to analyze properties
            </li>
            <li>
              • <strong>Double-click anywhere</strong> to explore locations
            </li>
            <li>
              • <strong>Use satellite mode</strong> and draw polygons for roof analysis
            </li>
            <li>
              • <strong>Search locations</strong> using the search bar below
            </li>
          </ul>
        </div>

        {/* Search Bar */}
        <SearchBar onLocationSelect={handleLocationSelect} />
      </div>

      {/* Detail Panel */}
      {(selectedLocation || selectedPolygon) && (
        <DetailPanel location={selectedLocation} polygon={selectedPolygon} onClose={handleClosePanel} />
      )}
    </div>
  )
}
