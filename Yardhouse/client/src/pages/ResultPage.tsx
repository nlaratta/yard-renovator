/**
 * @fileoverview Result page component for displaying the yard renovation result
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { imagesApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { ImageRequest, ProductSuggestion } from '../types';
import { createImageUrl, isDataUrl } from '../utils/gemini';

/**
 * Result page component
 * @returns {JSX.Element} Result page component
 */
const ResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useAuth();
  const { isAuthenticated } = state;
  
  const [imageRequest, setImageRequest] = useState<ImageRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  
  // Define fetchData with useCallback so it can be included in dependency arrays
  const fetchData = useCallback(async () => {
    try {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      const requestId = parseInt(id, 10);
      console.log(`Fetching renovation data for requestId: ${requestId}`);
      
      const requestData = await imagesApi.getRequest(requestId);
      console.log('API Response:', requestData);
      
      if (!requestData) {
        throw new Error('No data returned from API');
      }
      
      setImageRequest(requestData);
      
      // Debug info
      const debugData = {
        status: requestData.status,
        hasOptions: !!requestData.renovationOptions,
        hasImage: !!requestData.generatedImageUrl,
        imageType: requestData.generatedImageUrl ? 
          (isDataUrl(requestData.generatedImageUrl) ? 'data URL' : 'regular URL') : 'none',
        imageLength: requestData.generatedImageUrl ? requestData.generatedImageUrl.length : 0
      };
      
      console.log('Debug data:', debugData);
      setDebugInfo(JSON.stringify(debugData, null, 2));
      
      setIsLoading(false);
    } catch (err: any) {
      console.error('Error fetching request:', err);
      setError(`Failed to load renovation result: ${err.message || 'Unknown error'}`);
      setIsLoading(false);
    }
  }, [id]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Add polling for processing status
  useEffect(() => {
    if (!imageRequest || imageRequest.status !== 'processing') return;
    
    console.log('Starting polling for status updates...');
    
    const pollInterval = setInterval(async () => {
      try {
        if (!id) return;
        
        const requestId = parseInt(id, 10);
        console.log(`Polling for updates on requestId: ${requestId}`);
        
        const requestData = await imagesApi.getRequest(requestId);
        console.log('Polling response:', requestData);
        
        setImageRequest(requestData);
        
        // If no longer processing, clear the interval
        if (requestData.status !== 'processing') {
          console.log(`Status changed to ${requestData.status}, stopping polling`);
          clearInterval(pollInterval);
        }
      } catch (err) {
        console.error('Error polling request status:', err);
        // Don't set error here to avoid disrupting the UI during polling
      }
    }, 3000); // Check every 3 seconds
    
    return () => {
      console.log('Cleaning up polling interval');
      clearInterval(pollInterval);
    };
  }, [id, imageRequest]);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center my-12">
        <div className="spinner mb-4"></div>
        <p className="text-secondary-600">Loading your renovation result...</p>
      </div>
    );
  }
  
  if (error || !imageRequest) {
    return (
      <div className="card text-center p-8">
        <svg className="h-16 w-16 text-secondary-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-secondary-700 mb-2">Something Went Wrong</h2>
        <p className="text-secondary-600 mb-4">{error || 'Unable to load the renovation result.'}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <button onClick={fetchData} className="btn-primary">
            Try Again
          </button>
          <Link to="/" className="btn-secondary">
            Return Home
          </Link>
        </div>
        
        {debugInfo && (
          <div className="mt-8 p-4 bg-gray-100 rounded-md text-left overflow-auto max-h-96 text-xs">
            <h3 className="font-bold mb-2">Debug Information:</h3>
            <pre>{debugInfo}</pre>
          </div>
        )}
      </div>
    );
  }
  
  if (imageRequest.status === 'processing') {
    return (
      <div className="card text-center p-8">
        <div className="spinner mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-secondary-700 mb-2">Your Renovation is in Progress</h2>
        <p className="text-secondary-600 mb-4">
          We're working on your yard renovation. This typically takes about 30-60 seconds.
        </p>
        <p className="text-secondary-500 mb-6">
          This page will automatically update when your renovation is ready.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary"
        >
          Check Again
        </button>
      </div>
    );
  }
  
  if (imageRequest.status === 'failed') {
    return (
      <div className="card text-center p-8">
        <svg className="h-16 w-16 text-secondary-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl font-bold text-secondary-700 mb-2">Renovation Failed</h2>
        <p className="text-secondary-600 mb-4">
          We encountered an issue while generating your renovation. Please try again.
        </p>
        <Link to="/renovate" className="btn-primary">
          Try Again
        </Link>
      </div>
    );
  }
  
  // At this point, imageRequest.status is 'completed'
  const { renovationOptions, generatedImageUrl, affiliateLinks } = imageRequest;
  
  console.log('Rendering completed renovation:', {
    hasOptions: !!renovationOptions,
    optionsContent: renovationOptions,
    hasImage: !!generatedImageUrl,
    imageLength: generatedImageUrl?.length
  });
  
  // Check if image is a data URL (from Gemini) or a regular URL
  const imageUrl = generatedImageUrl ? createImageUrl(generatedImageUrl) : null;
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-secondary-800 mb-6">Your Yard Renovation</h1>
      
      {/* Renovated image display */}
      <div className="card mb-8 p-6">
        <h2 className="text-xl font-semibold text-secondary-700 mb-4">Renovation Result</h2>
        {imageUrl ? (
          <div className="mb-4">
            <img 
              src={imageUrl} 
              alt="Renovated yard" 
              className="w-full max-w-3xl mx-auto rounded-lg shadow-lg"
              onError={(e) => {
                console.error('Image failed to load:', imageUrl?.substring(0, 100) + '...');
                const target = e.target as HTMLImageElement;
                target.src = 'https://www.brighterbites.org/wp-content/uploads/2016/04/placeholder-800x600.png';
              }}
            />
          </div>
        ) : (
          <div className="bg-secondary-100 p-8 rounded-lg text-center">
            <svg className="h-16 w-16 text-secondary-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-secondary-600 font-medium">Image could not be displayed.</p>
            <p className="text-secondary-500 text-sm mt-2">The generated image may be missing or in an unsupported format.</p>
            <button 
              onClick={fetchData} 
              className="mt-4 px-4 py-2 bg-secondary-200 text-secondary-700 rounded-md hover:bg-secondary-300 transition-colors"
            >
              Reload
            </button>
          </div>
        )}
        
        {renovationOptions ? (
          <div className="bg-primary-50 border border-primary-200 rounded-md p-4 mb-4">
            <h3 className="font-semibold text-primary-700 mb-2">Selected Options</h3>
            <ul className="text-secondary-600">
              <li>
                <span className="font-medium">Theme:</span> {renovationOptions.theme}
              </li>
              <li>
                <span className="font-medium">Renovation Level:</span> {renovationOptions.level}
              </li>
              {renovationOptions.notes && (
                <li>
                  <span className="font-medium">Additional Notes:</span> {renovationOptions.notes}
                </li>
              )}
            </ul>
          </div>
        ) : (
          <div className="bg-secondary-50 border border-secondary-200 rounded-md p-4 mb-4">
            <h3 className="font-semibold text-secondary-700 mb-2">Renovation Details</h3>
            <p className="text-secondary-600">Renovation details are not available.</p>
          </div>
        )}
        
        {/* Debug information in development mode */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 border border-gray-200 rounded-md p-4 bg-gray-50 text-xs text-gray-600 overflow-auto">
            <h4 className="font-semibold mb-1">Debug Info</h4>
            <p>Status: {imageRequest.status}</p>
            <p>API response keys: {Object.keys(imageRequest).join(', ')}</p>
            <p>Has renovation options: {renovationOptions ? 'Yes' : 'No'}</p>
            <p>Has generated image: {generatedImageUrl ? 'Yes' : 'No'}</p>
            {generatedImageUrl && <p>Image URL type: {isDataUrl(generatedImageUrl) ? 'Data URL' : 'Regular URL'}</p>}
            {generatedImageUrl && <p>Image URL length: {generatedImageUrl.length} chars</p>}
            {generatedImageUrl && <p>Image URL preview: {generatedImageUrl.substring(0, 100)}...</p>}
          </div>
        )}
      </div>
      
      {/* Product recommendations */}
      {affiliateLinks && affiliateLinks.length > 0 && (
        <div className="card mb-8 p-6">
          <h2 className="text-xl font-semibold text-secondary-700 mb-4">Recommended Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {affiliateLinks.map((product: ProductSuggestion, index: number) => (
              <div key={index} className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-secondary-100">
                  <img 
                    src={product.productData.imageUrl} 
                    alt={product.productData.title} 
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://transitionswealthadvisors.com/wp-content/uploads/2015/03/300x200.gif';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-1 text-secondary-800 line-clamp-2">{product.productData.title}</h3>
                  <p className="text-primary-700 font-bold mb-2">{product.productData.price}</p>
                  <a 
                    href={product.affiliateLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-secondary w-full text-center block text-sm"
                  >
                    View on Amazon
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex flex-wrap justify-center gap-4">
        <Link to="/renovate" className="btn-primary">
          Create Another Renovation
        </Link>
        <Link to="/my-renovations" className="btn-secondary">
          View All Renovations
        </Link>
      </div>
      
      {/* Login prompt for non-authenticated users */}
      {!isAuthenticated && (
        <div className="bg-primary-50 border border-primary-200 rounded-md p-6 mt-8 text-center">
          <h3 className="text-xl font-semibold text-secondary-700 mb-2">Create Your Own Renovations</h3>
          <p className="text-secondary-600 mb-4">
            Sign in to create personalized yard renovations for your own outdoor spaces.
          </p>
          <a href="/login" className="btn-primary">
            Sign In to Get Started
          </a>
        </div>
      )}
    </div>
  );
};

export default ResultPage; 