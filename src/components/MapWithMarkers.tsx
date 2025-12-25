import { useEffect, useState, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet'
import L from '@/lib/leaflet-config'
import { motion, AnimatePresence } from 'framer-motion'
import { TrashBinType, BIN_CONFIGS } from '@/types'
import { MapPin, X, Search, Filter, Navigation, XCircle, CheckCircle2 } from 'lucide-react'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import logger from '@/lib/logger'
import MarkerClusterGroup from 'react-leaflet-markercluster'

interface MapMarker {
  id: string
  position: [number, number]
  type: TrashBinType
  label?: string
}

interface MapWithMarkersProps {
  markers: MapMarker[]
  onMarkerAdd?: (position: [number, number], type: TrashBinType) => void
  onMarkerRemove?: (id: string) => void
  selectedBinType: TrashBinType | null
  center?: [number, number]
  zoom?: number
  height?: string
  editable?: boolean
}

// Custom marker icon based on bin type
const createCustomIcon = (type: TrashBinType) => {
  const config = BIN_CONFIGS[type]
  const color = config.color.replace('bg-', '')
  
  // Map Tailwind colors to hex
  const colorMap: Record<string, string> = {
    'green-500': '#22c55e',
    'blue-500': '#3b82f6',
    'yellow-500': '#eab308',
    'red-500': '#ef4444',
    'purple-500': '#a855f7',
    'orange-500': '#f97316',
  }
  
  const hexColor = colorMap[color] || '#22c55e'
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${hexColor};
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        color: white;
      ">
        ${config.icon}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  })
}

// Component to handle map clicks
function MapClickHandler({
  onMapClick,
  enabled,
}: {
  onMapClick: (lat: number, lng: number) => void
  enabled: boolean
}) {
  useMapEvents({
    click: (e) => {
      if (enabled) {
        onMapClick(e.latlng.lat, e.latlng.lng)
      }
    },
  })
  return null
}

// Component to fly to location
function FlyToLocation({ position }: { position: [number, number] | null }) {
  const map = useMap()
  
  useEffect(() => {
    if (position) {
      map.flyTo(position, 15, {
        animate: true,
        duration: 1.5,
      })
    }
  }, [position, map])
  
  return null
}

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function MapWithMarkers({
  markers,
  onMarkerAdd,
  onMarkerRemove,
  selectedBinType,
  center = [55.7558, 37.6173], // Default: Moscow
  zoom = 13,
  height = '500px',
  editable = true,
}: MapWithMarkersProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>(center)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filteredTypes, setFilteredTypes] = useState<Set<TrashBinType>>(new Set())
  const [flyToPosition, setFlyToPosition] = useState<[number, number] | null>(null)
  const [nearestMarker, setNearestMarker] = useState<MapMarker | null>(null)

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc: [number, number] = [position.coords.latitude, position.coords.longitude]
          setUserLocation(loc)
          setMapCenter(loc)
        },
        () => {
          logger.debug('Geolocation not available', 'MapWithMarkers')
        }
      )
    }
  }, [])

  // Filter markers based on search and type filters
  const filteredMarkers = useMemo(() => {
    let filtered = markers

    // Filter by type
    if (filteredTypes.size > 0) {
      filtered = filtered.filter((marker) => filteredTypes.has(marker.type))
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((marker) => {
        const config = BIN_CONFIGS[marker.type]
        const label = marker.label || ''
        return (
          config.label.toLowerCase().includes(query) ||
          label.toLowerCase().includes(query) ||
          marker.id.toLowerCase().includes(query)
        )
      })
    }

    return filtered
  }, [markers, filteredTypes, searchQuery])

  // Find nearest marker to user location
  const findNearestMarker = () => {
    if (!userLocation || filteredMarkers.length === 0) {
      return
    }

    let nearest: MapMarker | null = null
    let minDistance = Infinity

    for (const marker of filteredMarkers) {
      const distance = calculateDistance(
        userLocation[0],
        userLocation[1],
        marker.position[0],
        marker.position[1]
      )
      if (distance < minDistance) {
        minDistance = distance
        nearest = marker
      }
    }

    if (nearest) {
      setNearestMarker(nearest)
      setFlyToPosition(nearest.position)
    }
  }

  // Toggle type filter
  const toggleTypeFilter = (type: TrashBinType) => {
    const newFilters = new Set(filteredTypes)
    if (newFilters.has(type)) {
      newFilters.delete(type)
    } else {
      newFilters.add(type)
    }
    setFilteredTypes(newFilters)
  }

  // Clear all filters
  const clearFilters = () => {
    setFilteredTypes(new Set())
    setSearchQuery('')
  }

  const handleMapClick = (lat: number, lng: number) => {
    if (editable && selectedBinType && onMarkerAdd) {
      onMarkerAdd([lat, lng], selectedBinType)
    }
  }

  const allTypes = Object.keys(BIN_CONFIGS) as TrashBinType[]
  const hasActiveFilters = filteredTypes.size > 0 || searchQuery.trim().length > 0

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-lg" style={{ height }}>
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        className="rounded-xl"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FlyToLocation position={flyToPosition} />
        
        {editable && (
          <MapClickHandler
            onMapClick={handleMapClick}
            enabled={!!selectedBinType}
          />
        )}

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={L.divIcon({
              className: 'user-location-marker',
              html: `
                <div style="
                  background-color: #3b82f6;
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                "></div>
              `,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          >
            <Popup>Your location</Popup>
          </Marker>
        )}

        {/* Bin markers with clustering */}
        {filteredMarkers.length > 0 && (
          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={50}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
            zoomToBoundsOnClick={true}
            iconCreateFunction={(cluster: any) => {
              const count = cluster.getChildCount()
              return L.divIcon({
                html: `<div style="
                  background-color: #22c55e;
                  color: white;
                  border-radius: 50%;
                  width: 40px;
                  height: 40px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  font-size: 14px;
                  border: 3px solid white;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                ">${count}</div>`,
                className: 'marker-cluster',
                iconSize: L.point(40, 40),
              })
            }}
          >
            {filteredMarkers.map((marker) => {
              const config = BIN_CONFIGS[marker.type]
              const isNearest = nearestMarker?.id === marker.id
              return (
                <Marker
                  key={marker.id}
                  position={marker.position}
                  icon={createCustomIcon(marker.type)}
                >
                  <Popup>
                    <div className="p-2">
                      {isNearest && (
                        <div className="mb-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold flex items-center gap-1">
                          <Navigation className="w-3 h-3" />
                          Nearest container
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{config.icon}</span>
                        <div>
                          <div className="font-semibold text-gray-800">{config.label}</div>
                          {marker.label && (
                            <div className="text-sm text-gray-600">{marker.label}</div>
                          )}
                        </div>
                      </div>
                      {userLocation && (
                        <div className="text-xs text-gray-500 mb-2">
                          Distance: {calculateDistance(
                            userLocation[0],
                            userLocation[1],
                            marker.position[0],
                            marker.position[1]
                          ).toFixed(2)} km
                        </div>
                      )}
                      {editable && onMarkerRemove && (
                        <button
                          onClick={() => onMarkerRemove(marker.id)}
                          className="mt-2 px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors flex items-center gap-1"
                        >
                          <X className="w-3 h-3" />
                          Remove
                        </button>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MarkerClusterGroup>
        )}
      </MapContainer>

      {/* Search and Filter Controls */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex gap-2">
        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg border-2 border-green-500/30 overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-2">
                <Search className="w-4 h-4 text-gray-500" aria-hidden="true" />
                <label htmlFor="container-search" className="sr-only">
                  Search containers
                </label>
                <input
                  id="container-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search containers..."
                  className="outline-none bg-transparent text-sm min-w-[200px] focus:ring-2 focus:ring-green-500 rounded"
                  aria-label="Search containers"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-gray-400 hover:text-gray-600 focus:ring-2 focus:ring-green-500 rounded"
                    aria-label="Clear search"
                  >
                    <XCircle className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`bg-white/95 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border-2 transition-colors flex items-center gap-2 focus:ring-2 focus:ring-green-500 focus:outline-none ${
            hasActiveFilters
              ? 'border-green-500 text-green-600'
              : 'border-gray-300 text-gray-700'
          }`}
          aria-label={`Filter containers${hasActiveFilters ? `, ${filteredTypes.size + (searchQuery ? 1 : 0)} active filters` : ''}`}
          aria-expanded={showFilters}
          aria-controls="filter-panel"
        >
          <Filter className="w-4 h-4" aria-hidden="true" />
          <span className="text-sm font-medium">Filter</span>
          {hasActiveFilters && (
            <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center" aria-label={`${filteredTypes.size + (searchQuery ? 1 : 0)} active filters`}>
              {filteredTypes.size + (searchQuery ? 1 : 0)}
            </span>
          )}
        </button>

        {/* Search Toggle */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="bg-white/95 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border-2 border-gray-300 text-gray-700 hover:border-green-500 hover:text-green-600 transition-colors flex items-center gap-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          aria-label={showSearch ? 'Hide search' : 'Show search'}
          aria-expanded={showSearch}
          aria-controls="container-search"
        >
          <Search className="w-4 h-4" aria-hidden="true" />
        </button>

        {/* Find Nearest Button */}
        {userLocation && filteredMarkers.length > 0 && (
          <button
            onClick={findNearestMarker}
            className="bg-white/95 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border-2 border-blue-500 text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Find nearest container"
          >
            <Navigation className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm font-medium">Nearest</span>
          </button>
        )}
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            id="filter-panel"
            role="dialog"
            aria-labelledby="filter-title"
            className="absolute top-20 left-4 z-[1000] bg-white/95 backdrop-blur-md rounded-xl shadow-lg border-2 border-green-500/30 p-4 min-w-[250px]"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 id="filter-title" className="font-semibold text-gray-800">Filter by Type</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 focus:ring-2 focus:ring-green-500 rounded"
                  aria-label="Clear all filters"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="space-y-2" role="group" aria-label="Container type filters">
              {allTypes.map((type) => {
                const config = BIN_CONFIGS[type]
                const isSelected = filteredTypes.has(type)
                return (
                  <button
                    key={type}
                    onClick={() => toggleTypeFilter(type)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors focus:ring-2 focus:ring-green-500 focus:outline-none ${
                      isSelected
                        ? 'bg-green-100 text-green-800 border-2 border-green-500'
                        : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
                    }`}
                    aria-pressed={isSelected}
                    aria-label={`Filter by ${config.label}${isSelected ? ', selected' : ''}`}
                  >
                    <span className="text-xl" aria-hidden="true">{config.icon}</span>
                    <span className="flex-1 text-left text-sm font-medium">{config.label}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4" aria-hidden="true" />}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions overlay */}
      {editable && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 z-[1000] pointer-events-none"
        >
          <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg border-2 border-green-500/30">
            {selectedBinType ? (
              <div className="flex items-center gap-3">
                <span className="text-2xl">{BIN_CONFIGS[selectedBinType].icon}</span>
                <div>
                  <div className="font-semibold text-gray-800">
                    Click on the map to place a {BIN_CONFIGS[selectedBinType].label} container
                  </div>
                  <div className="text-sm text-gray-600">
                    Selected: {BIN_CONFIGS[selectedBinType].label}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-gray-600">
                Select a container type to place markers on the map
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Marker count and filter info */}
      <div className="absolute bottom-4 right-4 z-[1000] flex flex-col gap-2">
        {markers.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/95 backdrop-blur-md rounded-xl px-4 py-2 shadow-lg border-2 border-green-500/30"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-gray-800">
                {filteredMarkers.length} / {markers.length} container{markers.length !== 1 ? 's' : ''}
              </span>
            </div>
          </motion.div>
        )}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-blue-100/95 backdrop-blur-md rounded-xl px-3 py-1.5 shadow-lg border-2 border-blue-500/30 text-xs text-blue-800 font-medium"
          >
            Filters active
          </motion.div>
        )}
      </div>
    </div>
  )
}
