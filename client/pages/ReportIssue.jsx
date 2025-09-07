import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Camera, MapPin, Mic, Upload, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import MapView from '../components/MapView'
import { issueAPI } from '../services/api'
import toast from 'react-hot-toast'

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: { address: '', coordinates: { lat: null, lng: null } }
  })
  const [images, setImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const { user } = useAuth()
  const navigate = useNavigate()

  const categories = [
    { value: 'pothole', label: 'Pothole', icon: '🕳️' },
    { value: 'streetlight', label: 'Broken Streetlight', icon: '💡' },
    { value: 'garbage', label: 'Garbage Overflow', icon: '🗑️' },
    { value: 'water', label: 'Water Leakage', icon: '💧' },
    { value: 'sewage', label: 'Sewage Problem', icon: '⚠️' },
    { value: 'road', label: 'Road Damage', icon: '🛣️' },
    { value: 'parks', label: 'Park Maintenance', icon: '🌳' },
    { value: 'other', label: 'Other Issue', icon: '❓' }
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))
    setImages(prev => [...prev, ...newImages])
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      location
    }))
    setCurrentStep(3)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to report an issue')
      navigate('/login')
      return
    }

    setIsSubmitting(true)
    try {
      // Convert images to base64 for upload
      const imagePromises = images.map(async (img) => {
        const base64 = await convertToBase64(img.file)
        return { url: base64, publicId: null }
      })
      const uploadedImages = await Promise.all(imagePromises)

      const issueData = {
        ...formData,
        images: uploadedImages
      }

      const response = await issueAPI.create(issueData)
      
      toast.success('Issue reported successfully!')
      navigate('/issues')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to report issue')
    } finally {
      setIsSubmitting(false)
    }
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Report a Civic Issue
          </h1>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep >= step
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 ${
                        currentStep > step ? 'bg-green-600' : 'bg-gray-300'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Category</span>
              <span>Location</span>
              <span>Details</span>
            </div>
          </div>

          {/* Step 1: Category Selection */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, category: category.value }))
                    setCurrentStep(2)
                  }}
                  className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="text-sm font-medium">{category.label}</div>
                </button>
              ))}
            </motion.div>
          )}

          {/* Step 2: Location Selection */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                <h2 className="text-xl font-semibold mb-4">Select Location</h2>
                <div className="h-96 rounded-lg overflow-hidden">
                  <MapView 
                    height="100%"
                    onMarkerClick={handleLocationSelect}
                  />
                </div>
                <div className="mt-4 flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>Click on the map to select location</span>
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg"
                >
                  Back
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Issue Details */}
          {currentStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Issue Details</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="input-field"
                        placeholder="Brief description of the issue"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={4}
                        className="input-field"
                        placeholder="Provide detailed information about the issue..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Photos (Optional)
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative">
                            <img
                              src={image.preview}
                              alt={`Preview ${index}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                          <Upload className="h-8 w-8 text-gray-400 mb-1" />
                          <span className="text-sm text-gray-500">Add Photo</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Selected Location
                      </label>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-2" />
                        <span>
                          {formData.location.address || 
                           `Lat: ${formData.location.coordinates.lat?.toFixed(4)}, Lng: ${formData.location.coordinates.lng?.toFixed(4)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default ReportIssue