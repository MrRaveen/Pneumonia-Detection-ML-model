'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import ImageUploader from './components/ImageUploader';
import AnalysisResult from './components/AnalysisResult';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ prediction: 'Normal' | 'Pneumonia', confidence: number } | null>(null);

  const handleImageSelected = (image: string | null) => {
    setSelectedImage(image);
    setResult(null); // Reset result when a new image is selected
  };

  const handleAnalyze = () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setResult(null);
    
    // Mock the ML model inference delay
    setTimeout(() => {
      setIsAnalyzing(false);
      // Randomly mock a result for demonstration purposes
      const isPneumonia = Math.random() > 0.5;
      setResult({
        prediction: isPneumonia ? 'Pneumonia' : 'Normal',
        confidence: isPneumonia ? 0.85 + Math.random() * 0.14 : 0.9 + Math.random() * 0.09,
      });
    }, 2500);
  };

  return (
    <main className={styles.main}>
      <header className={`${styles.hero} animate-fade-in`}>
        <h1 className={styles.title}>
          <span className="gradient-text">Pneumonia Detection</span> AI
        </h1>
        <p className={styles.subtitle}>
          Upload a Chest X-Ray image to receive an instant, AI-powered preliminary analysis using our custom Convolutional Neural Network.
        </p>
      </header>

      <div className={styles.contentWrapper}>
        <section className={`${styles.panel} glass-panel animate-fade-in`} style={{ animationDelay: '0.1s' }}>
          <h2 className={styles.panelTitle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--primary)' }}>
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            Upload X-Ray
          </h2>
          <ImageUploader 
            onImageSelected={handleImageSelected} 
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        </section>

        <section className={`${styles.panel} glass-panel animate-fade-in`} style={{ animationDelay: '0.2s' }}>
          <h2 className={styles.panelTitle}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent)' }}>
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            Analysis Results
          </h2>
          
          {!result && !isAnalyzing && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b', textAlign: 'center', gap: '1rem' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>Upload an image and click "Analyze X-Ray" to view the model's prediction.</p>
            </div>
          )}

          {isAnalyzing && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '1.5rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                border: '4px solid rgba(6, 182, 212, 0.1)',
                borderTopColor: 'var(--primary)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <style>{`
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              `}</style>
              <p style={{ color: 'var(--primary)', fontWeight: 500 }} className="pulse-animation">Running inference...</p>
            </div>
          )}

          {result && (
            <AnalysisResult prediction={result.prediction} confidence={result.confidence} />
          )}
        </section>
      </div>

      <footer className={`${styles.footer} animate-fade-in`} style={{ animationDelay: '0.4s' }}>
        <p>Built for the NeuralSquad Pneumonia Detection Project. Open Source & Educational.</p>
      </footer>
    </main>
  );
}
