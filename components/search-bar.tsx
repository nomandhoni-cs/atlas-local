"use client"

import { useState, useRef, useEffect } from "react"
import { Search, MapPin, Navigation, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void
}

export function SearchBar({ onLocationSelect }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const autocompleteService = useRef(null)
  const geocoder = useRef(null)
  const searchTimeout = useRef(null)

  useEffect(() => {
    // Initialize Google Maps services when available
    const initializeServices = () => {
      if (window.google && window.google.maps) {
        try {
          autocompleteService.current = new window.google.maps.places.AutocompleteService()
          geocoder.current = new window.google.maps.Geocoder()
        } catch (error) {
          console.error("Error initializing Google Maps services:", error)
        }
      }
    }

    // Check if Google Maps is already loaded
    if (window.google) {
      initializeServices()
    } else {
      // Wait for Google Maps to load
      const checkGoogleMaps = setInterval(() => {
        if (window.google && window.google.maps) {
          initializeServices()
          clearInterval(checkGoogleMaps)
        }
      }, 100)

      // Cleanup interval after 10 seconds
      setTimeout(() => clearInterval(checkGoogleMaps), 10000)
    }
  }, [])

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }

    if (value.length > 2 && autocompleteService.current) {
      setIsLoading(true)

      // Debounce the search
      searchTimeout.current = setTimeout(() => {
        autocompleteService.current.getPlacePredictions(
          {
            input: value,
            types: ["geocode", "establishment"],
            componentRestrictions: { country: "us" }, // Restrict to US for better results
          },
          (predictions, status) => {
            setIsLoading(false)
            if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
              setSuggestions(predictions.slice(0, 5))
              setShowSuggestions(true)
            } else {
              setSuggestions([])
              setShowSuggestions(false)
            }
          },
        )
      }, 300) // 300ms debounce
    } else {
      setSuggestions([])
      setShowSuggestions(false)
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.description)
    setShowSuggestions(false)
    setIsLoading(true)

    if (geocoder.current) {
      geocoder.current.geocode({ placeId: suggestion.place_id }, (results, status) => {
        setIsLoading(false)
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location
          onLocationSelect({
            lat: location.lat(),
            lng: location.lng(),
          })
        } else {
          console.error("Geocoding failed:", status)
        }
      })
    }
  }

  const handleSearch = () => {
    if (query && geocoder.current) {
      setIsLoading(true)
      setShowSuggestions(false)

      geocoder.current.geocode({ address: query }, (results, status) => {
        setIsLoading(false)
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location
          onLocationSelect({
            lat: location.lat(),
            lng: location.lng(),
          })
        } else {
          console.error("Geocoding failed:", status)
        }
      })
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }

  return (
    <div className="relative">
      <div className="bg-white backdrop-blur-sm rounded-xl p-6 shadow-2xl max-w-sm border border-green-100">
        <h3 className="font-bold text-base mb-4 text-green-600 font-['Urbanist',sans-serif] flex items-center">
          <Navigation className="h-5 w-5 mr-2" />
          Search Location:
        </h3>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Enter address or location..."
              value={query}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="pr-10 font-['Urbanist',sans-serif] border-2 border-green-200 focus:border-green-400 text-base py-3 rounded-lg"
              disabled={isLoading}
            />
            {isLoading ? (
              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600 animate-spin" />
            ) : (
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            )}
          </div>
          <Button
            onClick={handleSearch}
            size="lg"
            disabled={isLoading || !query}
            className="bg-green-600 hover:bg-green-700 text-white font-['Urbanist',sans-serif] font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Go"}
          </Button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border-2 border-green-200 z-50 max-h-80 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={suggestion.place_id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full text-left px-4 py-4 hover:bg-green-50 flex items-center gap-3 font-['Urbanist',sans-serif] text-base border-b border-green-100 last:border-b-0 transition-colors duration-150"
              >
                <MapPin className="h-5 w-5 text-green-600 flex-shrink-0" />
                <span className="truncate font-medium">{suggestion.description}</span>
              </button>
            ))}
          </div>
        )}

        {/* No Google Maps Services Warning */}
        {!autocompleteService.current && !isLoading && (
          <div className="mt-2 text-xs text-amber-600 font-['Urbanist',sans-serif]">
            Search will be available once Google Maps loads...
          </div>
        )}
      </div>
    </div>
  )
}
