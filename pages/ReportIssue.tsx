import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { generateDescriptionFromImage, analyzeIssue } from '../services/geminiService';
import { getGpsCoordinates } from '../services/exifService';
import { IssueCategory, Issue, IssueStatus, Department } from '../types';
import { PhotoIcon, MicrophoneIcon, MapPinIcon, SpinnerIcon, CameraIcon, BuildingOffice2Icon } from '../components/icons';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { categoryToDepartmentMap } from '../constants';

// Extend window type for SpeechRecognition
interface IWindow extends Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

interface ReportIssueProps {
  onIssueSubmit: (issue: Issue) => void;
}

type AnalysisResult = {
  isRelevant: boolean;
  category: IssueCategory;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  reasoning: string;
};


const ReportIssue: React.FC<ReportIssueProps> = ({ onIssueSubmit }) => {
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('Provide a photo to detect location.');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isManualAddress, setIsManualAddress] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const captureModeRef = useRef<'upload' | 'camera' | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Detect if the user agent is likely a mobile device.
    const isMobile = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    setIsMobileDevice(isMobile);
  }, []);

  const fetchAddress = async (latitude: number, longitude: number) => {
    setAddress(`Fetching address for Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}...`);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      if (!response.ok) throw new Error('Failed to fetch address from API');
      const data = await response.json();
      setAddress(data.display_name || `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      setAddress(`Location captured at Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
    }
  };
  
  useEffect(() => {
    const { SpeechRecognition, webkitSpeechRecognition } = (window as any as IWindow);
    if (!SpeechRecognition && !webkitSpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognitionAPI = SpeechRecognition || webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setDescription(prev => prev ? `${prev} ${transcript}` : transcript);
    };
    recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setError(`Voice input error: ${event.error}. Please type manually.`);
        setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    return () => { if (recognitionRef.current) recognitionRef.current.stop(); };
  }, []);

  const resetState = () => {
    setImageFile(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setDescription('');
    setError(null);
    setAddress('Provide a photo to detect location.');
    setIsManualAddress(false);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const processImageAndGenerateDescription = async (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    setProcessingMessage('AI is generating a description...');
    setIsGeneratingDescription(true);
    try {
        const generatedDesc = await generateDescriptionFromImage(file);
        setDescription(generatedDesc);
    } catch (err) {
        console.error("Error during description generation:", err);
        setError("Failed to generate AI description, but you can still proceed.");
    } finally {
        setIsGeneratingDescription(false);
    }
  };
  
  const processUploadedImage = async (file: File) => {
    try {
        setProcessingMessage('Reading location data from image...');
        const coordinates = await getGpsCoordinates(file);
        if (coordinates) {
            setProcessingMessage('Geotag found! Fetching address...');
            await fetchAddress(coordinates.latitude, coordinates.longitude);
        } else {
            setProcessingMessage('');
            setAddress('');
            setIsManualAddress(true);
        }
        await processImageAndGenerateDescription(file);
    } catch (err: any) {
        setError(err.message || 'An error occurred while processing the uploaded image.');
        resetState();
    } finally {
        setIsProcessing(false);
        setProcessingMessage('');
    }
  };

  const processCameraImage = async (file: File) => {
    try {
        setProcessingMessage('Getting your current location...');
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            });
        });
        
        setProcessingMessage('Fetching address...');
        await fetchAddress(position.coords.latitude, position.coords.longitude);
        await processImageAndGenerateDescription(file);
    } catch (geoError: any) {
        console.error("Geolocation error:", geoError);
        let message = "Could not get your location automatically. Please enter it manually.";
        if (geoError.code === geoError.PERMISSION_DENIED) {
            message = "Location permission denied. You'll need to enter the address manually.";
        }
        setError(message);
        setIsManualAddress(true);
        setAddress('');
        await processImageAndGenerateDescription(file); // Still process the image
    } finally {
         setIsProcessing(false);
         setProcessingMessage('');
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const mode = captureModeRef.current;
    captureModeRef.current = null; // Reset for next use
    
    resetState();
    setIsProcessing(true);
    setError(null);
    
    if (mode === 'upload') {
        await processUploadedImage(file);
    } else if (mode === 'camera') {
        await processCameraImage(file);
    } else {
        setError("An unexpected error occurred. Please try again.");
        setIsProcessing(false);
    }
  };

  const handleUploadClick = () => {
    if (!fileInputRef.current) return;
    captureModeRef.current = 'upload';
    fileInputRef.current.accept = 'image/jpeg,image/png';
    fileInputRef.current.removeAttribute('capture');
    fileInputRef.current.click();
  };
  
  const handleTakePhotoClick = () => {
    if (!fileInputRef.current) return;
    captureModeRef.current = 'camera';
    fileInputRef.current.accept = 'image/*';
    // The 'capture' attribute is a hint for mobile browsers to open the camera directly.
    // Desktop browsers will typically open a file picker regardless.
    fileInputRef.current.setAttribute('capture', 'environment');
    fileInputRef.current.click();
  };

  const handleToggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleAnalyze = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!imageFile || !description || !address) {
      setError('Please provide a photo, location, and description.');
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      const result = await analyzeIssue(imageFile, description);
      if (result.isRelevant) {
        setAnalysisResult(result);
      } else {
        setError(result.reasoning || 'AI analysis determined this image is not a valid civic issue. Please upload a relevant photo.');
        setAnalysisResult(null);
      }
    } catch (err) {
      setError('Failed to analyze the issue. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageFile, description, address]);
  
  const handleConfirmAndPost = () => {
    if (!analysisResult || !imagePreview) return;
    
    const assignedDepartment = categoryToDepartmentMap[analysisResult.category];

    const newIssue: Issue = {
      id: `issue_${Date.now()}`,
      title: `${analysisResult.category} at ${address.split(',')[0]}`,
      description: description,
      category: analysisResult.category,
      status: IssueStatus.Reported,
      imageUrl: imagePreview,
      address: address,
      reportedBy: user?.name || 'Community Reporter',
      reportedAt: new Date(),
      upvotes: 0,
      priority: analysisResult.priority,
      timeline: [{ status: IssueStatus.Reported, date: new Date(), notes: 'Issue reported by citizen.' }],
      assignedDepartment: assignedDepartment,
    };
    
    onIssueSubmit(newIssue);
    navigate('/issues');
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <h1 className="text-4xl font-bold text-center text-cyan-400 mb-8">Report a New Issue</h1>
      
      <form onSubmit={handleAnalyze} className="space-y-8 bg-gray-800/50 p-8 rounded-lg border border-gray-700 shadow-lg">
        <div>
          <label className="block text-lg font-medium text-gray-300 mb-2">1. Add a Photo</label>
          <input ref={fileInputRef} type="file" className="sr-only" onChange={handleFileChange} />
          
          <div className="mt-2 space-y-4">
              {isProcessing && (
                  <div className="flex justify-center p-10">
                    <Loader message={processingMessage || 'Processing image...'} />
                  </div>
              )}
              {imagePreview && !isProcessing && (
                  <div className="flex justify-center rounded-lg border border-dashed border-gray-600 p-2">
                      <img src={imagePreview} alt="Issue preview" className="max-h-60 rounded-lg" />
                  </div>
              )}
              {!imagePreview && !isProcessing && (
                 <div className="flex flex-col sm:flex-row justify-center items-center gap-4 py-6 rounded-lg border border-dashed border-gray-600">
                    <button type="button" onClick={handleUploadClick} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-full transition-colors">
                        <PhotoIcon className="h-5 w-5" />
                        <span>Upload Photo</span>
                    </button>
                    <div className="text-center">
                        <button type="button" onClick={handleTakePhotoClick} className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-full transition-colors">
                            <CameraIcon className="h-5 w-5" />
                            <span>Take Photo</span>
                        </button>
                        {!isMobileDevice && <p className="text-xs text-gray-500 mt-1">On desktop, this opens a file browser.</p>}
                    </div>
                 </div>
              )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="location" className="block text-lg font-medium text-gray-300 mb-2">2. Location</label>
              {isManualAddress ? (
                  <input
                    id="location"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Please enter the street address..."
                    className="block w-full h-full rounded-md border-0 bg-white/5 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm sm:leading-6 transition-colors"
                  />
              ) : (
                <div className="flex items-center p-3 rounded-md bg-white/5 text-gray-300 ring-1 ring-inset ring-gray-600 h-full">
                    <MapPinIcon className="h-5 w-5 mr-2 text-cyan-400 flex-shrink-0"/>
                    <span className="text-sm">{address}</span>
                </div>
              )}
            </div>
            <div>
              <label htmlFor="description" className="block text-lg font-medium text-gray-300 mb-2">3. Description</label>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full rounded-md border-0 bg-white/5 py-2 px-3 text-white shadow-sm ring-1 ring-inset ring-gray-600 focus:ring-2 focus:ring-inset focus:ring-cyan-500 sm:text-sm sm:leading-6 transition-colors pr-10"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={isListening ? "Listening..." : "AI can generate this, or you can write/speak your own."}
                  disabled={isGeneratingDescription}
                />
                {isGeneratingDescription && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-md">
                        <SpinnerIcon className="h-5 w-5 text-cyan-400 animate-spin mr-2"/>
                        <span className="text-sm text-cyan-300">AI is writing...</span>
                    </div>
                )}
                 <button
                    type="button"
                    onClick={handleToggleListening}
                    aria-label={isListening ? 'Stop recording' : 'Start recording description'}
                    className={`absolute top-2 right-2 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 ${isListening ? 'text-red-500 animate-pulse ring-2 ring-red-500' : 'text-gray-400 hover:text-cyan-400'}`}
                >
                    <MicrophoneIcon className="h-5 w-5"/>
                </button>
              </div>
            </div>
        </div>
        
        {error && <p className="text-red-400 text-center">{error}</p>}

        <div className="text-center pt-4 border-t border-gray-700">
         <label className="block text-lg font-medium text-gray-300 mb-2">4. Analyze & Submit</label>
          <button
            type="submit"
            disabled={isAnalyzing || isProcessing || !imageFile || !description || !address}
            className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold text-lg py-3 px-12 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-cyan-500/30 disabled:shadow-none"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Issue'}
          </button>
        </div>
      </form>

      {isAnalyzing && (
        <div className="mt-8 text-center">
            <Loader message="Our AI is classifying the issue..."/>
        </div>
      )}

      {analysisResult && (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-green-500/10 border border-green-500 rounded-lg text-center space-y-4"
        >
            <h2 className="text-2xl font-bold text-green-300 mb-2">Analysis Complete! Review & Post</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-gray-900/50 p-3 rounded-lg">
                    <p className="text-sm text-gray-400">Identified Category</p>
                    <p className="text-lg font-semibold text-white">{analysisResult.category}</p>
                </div>
                <div className="bg-gray-900/50 p-3 rounded-lg">
                    <p className="text-sm text-gray-400">Suggested Priority</p>
                    <p className="text-lg font-semibold text-white">{analysisResult.priority}</p>
                </div>
                <div className="md:col-span-2 bg-gray-900/50 p-3 rounded-lg">
                    <p className="text-sm text-gray-400">AI Reasoning</p>
                    <p className="text-sm italic text-gray-300">"{analysisResult.reasoning}"</p>
                </div>
            </div>

            <div className="mt-4 p-4 bg-gray-900/50 rounded-lg flex items-center justify-center space-x-3 border border-cyan-500/30">
                <BuildingOffice2Icon className="w-6 h-6 text-cyan-400 flex-shrink-0" />
                <div>
                    <p className="text-sm text-gray-400">Smart Routing</p>
                    <p className="font-semibold text-white">
                    {categoryToDepartmentMap[analysisResult.category] 
                        ? `Assigning to: ${categoryToDepartmentMap[analysisResult.category]}` 
                        : 'Will be manually assigned by an admin'}
                    </p>
                </div>
            </div>
          
            <div className="flex justify-center gap-4 pt-4">
                <button
                    onClick={handleConfirmAndPost}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
                >
                    Confirm & Post Issue
                </button>
                <button
                    onClick={() => {
                        setAnalysisResult(null);
                        setError(null);
                    }}
                    className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-full transition-colors"
                >
                    Make Changes
                </button>
            </div>
        </motion.div>
      )}

    </motion.div>
  );
};

export default ReportIssue;