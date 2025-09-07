import { useState, useRef, useEffect } from 'react'
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { motion } from 'framer-motion'
import { AlertTriangle, MapPin, Clock, User } from 'lucide-react'

const containerStyle = {
  width: '100%',
  height: '400px'
}

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
}

const MapView = ({ height = '400px', issues = [], onMarkerClick }) => {
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [map, setMap] = useState(null)
  const mapRef = useRef()

  // Sample issues data if none provided
  const sampleIssues = issues.length > 0 ? issues : [
    {
      _id: '1',
      title: 'Pothole on Main Street',
      category: 'pothole',
      status: 'reported',
      priority: 'high',
      location: {
        coordinates: { lat: 40.7128, lng: -74.0060 }
      },
      createdAt: new Date(),
      upvoteCount: 5
    },
    {
      _id: '2',
      title: 'Broken Streetlight',
      category: 'streetlight',
      status: 'in_progress',
      priority: 'medium',
      location: {
        coordinates: { lat: 40.715, lng: -74.01 }
      },
      createdAt: new Date(Date.now() - 86400000),
      upvoteCount: 3
    }
  ]

  const onLoad = React.useCallback(function callback(map) {
    mapRef.current = map
    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  const getMarkerIcon = (category, priority) => {
    const colors = {
      high: '#EF4444',
      medium: '#F59E0B',
      low: '#10B981',
      critical: '#7C3AED'
    }
    
    const icons = {
      pothole: '🚧',
      streetlight: '💡',
      garbage: '🗑️',
      water: '💧',
      sewage: '⚠️',
      road: '🛣️',
      parks: '🌳',
      other: '📍'
    }
    
    return {
      url: `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="18" fill="${colors[priority] || '#6B7280'}" stroke="white" stroke-width="2"/>
          <text x="20" y="26" font-size="16" text-anchor="middle" fill="white">${icons[category] || '📍'}</text>
        </svg>
      `)}`,
      scaledSize: new window.google.maps.Size(40, 40),
      origin: new window.google.maps.Point(0, 0),
      anchor: new window.google.maps.Point(20, 40)
    }
  }

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerStyle={{ ...containerStyle, height }}
        center={defaultCenter}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: [
            {
              featureType: 'poi',
              stylers: [{ visibility: 'off' }]
            }
          ]
        }}
      >
        {sampleIssues.map((issue) => (
          <Marker
            key={issue._id}
            position={{
              lat: issue.location.coordinates.lat,
              lng: issue.location.coordinates.lng
            }}
            icon={getMarkerIcon(issue.category, issue.priority)}
            onClick={() => {
              setSelectedIssue(issue)
              onMarkerClick && onMarkerClick(issue)
            }}
          />
        ))}

        {selectedIssue && (
          <InfoWindow
            position={{
              lat: selectedIssue.location.coordinates.lat,
              lng: selectedIssue.location.coordinates.lng
            }}
            onCloseClick={() => setSelectedIssue(null)}
          >
            <motion.div 
              className="p-2 max-w-xs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h3 className="font-semibold text-gray-800 mb-2">{selectedIssue.title}</h3>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <AlertTriangle className="h-4 w-4 mr-1" />
                <span className="capitalize">{selectedIssue.category}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Clock className="h-4 w-4 mr-1" />
                <span>{new Date(selectedIssue.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-1" />
                <span>{selectedIssue.upvoteCount} upvotes</span>
              </div>
              <div className={`mt-2 px-2 py-1 rounded-full text-xs font-medium inline-block ${
                selectedIssue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                selectedIssue.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {selectedIssue.status.replace('_', ' ')}
              </div>
            </motion.div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  )
}

export default MapView