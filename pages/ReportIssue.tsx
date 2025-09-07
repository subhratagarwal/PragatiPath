import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { generateDescriptionFromImage, analyzeIssue } from '../services/geminiService';
import { IssueCategory, Issue, IssueStatus } from '../types';
import { PhotoIcon, MicrophoneIcon, MapPinIcon, SpinnerIcon, CameraIcon } from '../components/icons';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

// Extend window type for SpeechRecognition
interface IWindow extends Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

interface ReportIssueProps {
  onIssueSubmit: (issue: Issue) => void;
}

const ReportIssue: React.FC<ReportIssueProps> = ({ onIssueSubmit }) => {
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('Fetching location...');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{ category: IssueCategory, priority: 'Low' | 'Medium' | 'High' | 'Critical', reasoning: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const recognitionRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user } = useAuth();
  
  // FIX: Assign motion component to a capitalized variable to resolve TypeScript type inference issue.
  const MotionDiv = motion.div;

  useEffect(() => {
    const fetchAddress = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        if (!response.ok) {
          throw new Error('Failed to fetch address from API');
        }
        const data = await response.json();
        setAddress(data.display_name || `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
      } catch (err) {
        console.error("Reverse geocoding error:", err);
        setAddress(`Location captured near Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
      }
    };
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchAddress(latitude, longitude);
        },
        (err) => {
          console.error("Geolocation error:", err);
          setAddress("Could not fetch location. Please enter manually.");
        }
      );
    } else {
      setAddress("Geolocation not supported. Please enter manually.");
    }
  }, []);
  
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

    recognition.onend = () => {
        setIsListening(false);
    };
    
    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleToggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleImageFile = async (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setAnalysisResult(null);
    setDescription('');
    setError(null);
    setIsCameraOpen(false); // Close camera if it was open

    setIsGeneratingDescription(true);
    try {
      const generatedDesc = await generateDescriptionFromImage(file);
      setDescription(generatedDesc);
    } catch (err) {
      setError('Could not auto-generate description. Please write one manually.');
      console.error(err);
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      handleImageFile(event.target.files[0]);
    }
  };

  const openCamera = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Camera is not supported on this device.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraOpen(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please check permissions.");
    }
  };

  const closeCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    setCameraStream(null);
    setIsCameraOpen(false);
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        canvas.toBlob(async (blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            await handleImageFile(file);
          }
        }, 'image/jpeg');
      }
      closeCamera();
    }
  };

  const handleAnalyze = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!imageFile || !description) {
      setError('Please provide both an image and a description.');
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      const result = await analyzeIssue(imageFile, description);
      setAnalysisResult(result);
    } catch (err) {
      setError('Failed to analyze the issue. Please try again.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageFile, description]);
  
  const handleConfirmAndPost = () => {
    if (!analysisResult || !imagePreview) return;
    
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
      timeline: [{ status: IssueStatus.Reported, date: new Date() }],
    };
    
    onIssueSubmit(newIssue);
    navigate('/issues');
  };

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <h1 className="text-4xl font-bold text-center text-cyan-400 mb-8">Report a New Issue</h1>
      
      <form onSubmit={handleAnalyze} className="space-y-8 bg-gray-800/50 p-8 rounded-lg border border-gray-700 shadow-lg">
        <div>
          <label className="block text-lg font-medium text-gray-300 mb-2">1. Add a Photo</label>
          <p className="text-sm text-gray-400 mb-2">Use your camera or upload a file. The AI will generate a description.</p>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-600 px-6 py-10 hover:border-cyan-400 transition-colors relative overflow-hidden">
            {isCameraOpen ? (
                <div className="w-full text-center">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-auto rounded-lg" />
                    <div className="mt-4 flex justify-center space-x-4">
                        <button type="button" onClick={handleCapture} className="px-6 py-3 bg-cyan-500 text-white rounded-full font-bold">Capture</button>
                        <button type="button" onClick={closeCamera} className="px-6 py-3 bg-gray-600 text-white rounded-full">Cancel</button>
                    </div>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
            ) : imagePreview ? (
              <img src={imagePreview} alt="Issue preview" className="max-h-60 rounded-lg" />
            ) : (
              <div className="text-center">
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-500" aria-hidden="true" />
                 <div className="mt-4 flex flex-col sm:flex-row items-center justify-center text-sm leading-6 text-gray-400">
                  <label htmlFor="image-upload" className="relative cursor-pointer rounded-md bg-gray-800 font-semibold text-cyan-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-cyan-500 px-3 py-1">
                    <span>Upload a file</span>
                    <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                  </label>
                  <span className="mx-2 my-2 sm:my-0">or</span>
                  <button type="button" onClick={openCamera} className="relative cursor-pointer rounded-md bg-gray-800 font-semibold text-cyan-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-cyan-500 flex items-center px-3 py-1">
                    <CameraIcon className="w-5 h-5 mr-1" />
                    <span>Take a Photo</span>
                  </button>
                </div>
                <p className="text-xs leading-5 text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-300 mb-2">2. Location</label>
              <div className="flex items-center p-3 rounded-md bg-white/5 text-gray-300 ring-1 ring-inset ring-gray-600 h-full">
                  <MapPinIcon className="h-5 w-5 mr-2 text-cyan-400"/>
                  <span className="text-sm">{address}</span>
              </div>
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
                  placeholder={isListening ? "Listening..." : "AI will generate this, or you can write/speak your own."}
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
                    className={`absolute top-2 right-2 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-300 ${
                        isListening ? 'text-red-500 animate-pulse ring-2 ring-red-500' : 'text-gray-400 hover:text-cyan-400'
                    }`}
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
            disabled={isAnalyzing || isGeneratingDescription || !imageFile || !description}
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
        <MotionDiv 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 bg-green-500/10 border border-green-500 rounded-lg text-center"
        >
          <h2 className="text-2xl font-bold text-green-300 mb-4">Analysis Complete!</h2>
          <p className="text-lg"><strong>Category:</strong> {analysisResult.category}</p>

          <p className="text-lg"><strong>Priority:</strong> {analysisResult.priority}</p>
          <p className="text-gray-300 mt-2"><em>"{analysisResult.reasoning}"</em></p>
          <button 
            onClick={handleConfirmAndPost}
            className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition-colors"
          >
            Confirm & Post Issue
          </button>
        </MotionDiv>
      )}
    </MotionDiv>
  );
};

export default ReportIssue;