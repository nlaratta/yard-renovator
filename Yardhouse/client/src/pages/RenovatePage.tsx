/**
 * @fileoverview Renovation page component for image upload and renovation options
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { imagesApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { RenovationTheme, RenovationLevel } from '../types';
import { RENOVATION_THEMES, RENOVATION_LEVELS } from '../utils/constants';

/**
 * Renovation page component
 * @returns {JSX.Element} Renovate page component
 */
const RenovatePage: React.FC = () => {
  const navigate = useNavigate();
  const { state, refreshUser } = useAuth();
  const { user } = state;
  
  // References
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [themes, setThemes] = useState<RenovationTheme[]>(RENOVATION_THEMES);
  const [levels, setLevels] = useState<RenovationLevel[]>(RENOVATION_LEVELS);
  const [selectedTheme, setSelectedTheme] = useState<string>(RENOVATION_THEMES[0]?.id || '');
  const [selectedLevel, setSelectedLevel] = useState<string>(RENOVATION_LEVELS[1]?.id || '');
  const [sliderValue, setSliderValue] = useState<number>(1); // Default to middle option (Enhanced)
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  
  // Load themes and levels on component mount
  useEffect(() => {
    const loadOptions = async () => {
      try {
        setIsLoading(true);
        
        // Try to fetch from API, fall back to constants if API fails
        try {
          const themesData = await imagesApi.getThemes();
          if (themesData && themesData.length > 0) {
            setThemes(themesData);
            setSelectedTheme(themesData[0].id);
          }
        } catch (error) {
          console.warn('Using default themes due to API error:', error);
          setThemes(RENOVATION_THEMES);
          setSelectedTheme(RENOVATION_THEMES[0].id);
        }
        
        try {
          const levelsData = await imagesApi.getLevels();
          if (levelsData && levelsData.length > 0) {
            setLevels(levelsData);
            // Default to middle level
            const middleIndex = Math.floor(levelsData.length / 2);
            setSelectedLevel(levelsData[middleIndex].id);
            setSliderValue(middleIndex);
          }
        } catch (error) {
          console.warn('Using default levels due to API error:', error);
          setLevels(RENOVATION_LEVELS);
          setSelectedLevel(RENOVATION_LEVELS[1].id); // Default to Enhanced
          setSliderValue(1);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading renovation options:', error);
        setError('Failed to load renovation options. Please try again.');
        setIsLoading(false);
      }
    };
    
    loadOptions();
  }, []);
  
  /**
   * Handle file input change
   * @param {React.ChangeEvent<HTMLInputElement>} e - Change event
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file type
      if (!selectedFile.type.match('image.*')) {
        setError('Please select an image file');
        return;
      }
      
      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size should be less than 10MB');
        return;
      }
      
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
    }
  };
  
  /**
   * Handle form submission
   * @param {React.FormEvent<HTMLFormElement>} e - Form event
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select an image');
      return;
    }
    
    if (!selectedTheme) {
      setError('Please select a renovation theme');
      return;
    }
    
    if (!selectedLevel) {
      setError('Please select a renovation level');
      return;
    }
    
    try {
      setIsUploading(true);
      setError(null);
      
      // Create form data
      const formData = new FormData();
      formData.append('image', file);
      formData.append('theme', selectedTheme);
      formData.append('level', selectedLevel);
      if (notes) formData.append('notes', notes);
      
      // Upload image and get request ID
      const response = await imagesApi.upload(formData);
      
      // The credit balance is updated server-side, so we need to refresh user data
      refreshUser();
      
      // Navigate to result page
      navigate(`/result/${response.requestId}`);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
      setIsUploading(false);
    }
  };
  
  /**
   * Trigger file input click
   */
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  /**
   * Reset the form
   */
  const resetForm = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Handle slider change for renovation level
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);
    setSelectedLevel(levels[value].id);
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-secondary-800 mb-6">Renovate Your Yard</h1>
      <p className="text-lg text-secondary-600 mb-8">
        Upload a photo of your yard or outdoor space, choose your renovation preferences, and let our AI transform it.
        This will use 1 credit from your balance.
      </p>
      
      {/* Credit balance display */}
      <div className="card mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-secondary-700">Your Credits</h2>
          <p className="text-secondary-600">
            You have <span className="font-bold text-primary-700">{user?.creditBalance || 0} credits</span> available
          </p>
        </div>
        {(user?.creditBalance || 0) < 1 && (
          <a 
            href="/pricing" 
            className="btn-primary"
          >
            Buy Credits
          </a>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="spinner"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image upload section */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-700 mb-4">Upload Your Yard Photo</h2>
            <div 
              className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer ${
                previewUrl ? 'border-primary-300 bg-primary-50' : 'border-secondary-300 hover:border-primary-300 hover:bg-primary-50'
              } transition-colors`}
              onClick={triggerFileInput}
            >
              {previewUrl ? (
                <div className="relative w-full">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-h-64 mx-auto rounded-lg"
                  />
                  <button 
                    type="button"
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-secondary-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      resetForm();
                    }}
                  >
                    <svg className="h-5 w-5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <svg className="h-12 w-12 text-secondary-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-secondary-600 mb-2">Click to upload your yard photo</p>
                  <p className="text-sm text-secondary-500">JPG, PNG up to 10MB</p>
                </>
              )}
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <p className="text-sm text-secondary-500 mt-2">
              For best results, use a clear photo taken during daylight hours that shows the entire area you want to renovate.
            </p>
          </div>
          
          {/* Renovation options section */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-700 mb-4">Choose Renovation Options</h2>
            
            {/* Theme selection */}
            <div className="mb-6">
              <label htmlFor="theme" className="form-label">Renovation Theme</label>
              <select
                id="theme"
                className="input-field"
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                required
              >
                {themes.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-secondary-500 mt-2">
                {themes.find(t => t.id === selectedTheme)?.description || ''}
              </p>
            </div>
            
            {/* Level selection slider */}
            <div className="mb-6">
              <label htmlFor="level-slider" className="form-label">Renovation Level</label>
              
              <div className="mt-2">
                <input
                  id="level-slider"
                  type="range"
                  min="0"
                  max={levels.length - 1}
                  value={sliderValue}
                  onChange={handleSliderChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                
                <div className="flex justify-between text-xs text-secondary-600 px-1 mt-1">
                  {levels.map((level, index) => (
                    <div 
                      key={level.id} 
                      className={`text-center ${index === sliderValue ? 'font-bold text-primary-700' : ''}`}
                      style={{ width: `${100 / levels.length}%` }}
                    >
                      {level.name}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-secondary-50 rounded-md border border-secondary-100">
                <h4 className="font-medium text-secondary-800">{levels[sliderValue]?.name}</h4>
                <p className="text-sm text-secondary-600 mt-1">
                  {levels[sliderValue]?.description || ''}
                </p>
              </div>
            </div>
            
            {/* Notes */}
            <div className="mb-4">
              <label htmlFor="notes" className="form-label">Additional Notes (Optional)</label>
              <textarea
                id="notes"
                className="input-field"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific features or elements you'd like to include in your renovation?"
              ></textarea>
            </div>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="col-span-1 md:col-span-2 bg-red-50 border border-red-300 text-red-800 rounded-md p-4">
              <p>{error}</p>
            </div>
          )}
          
          {/* Submit button */}
          <div className="col-span-1 md:col-span-2 flex justify-center">
            <button
              type="submit"
              disabled={isUploading || !file || (user?.creditBalance || 0) < 1}
              className={`btn-accent px-8 py-3 text-lg flex items-center ${
                isUploading || !file || (user?.creditBalance || 0) < 1
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
              }`}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Generate Renovation'
              )}
            </button>
          </div>
          
          {/* Credit disclaimer */}
          <div className="col-span-1 md:col-span-2 text-center text-sm text-secondary-500">
            By clicking "Generate Renovation", 1 credit will be deducted from your account.
          </div>
        </form>
      )}
    </div>
  );
};

export default RenovatePage; 