'use client';

import React, { useState, useRef } from 'react';
import styles from './ImageUploader.module.css';

interface ImageUploaderProps {
  onImageSelected: (image: string | null) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export default function ImageUploader({ onImageSelected, onAnalyze, isAnalyzing }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onImageSelected(url);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    onImageSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.container}>
      {!previewUrl ? (
        <div
          className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className={styles.uploadIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p className={styles.uploadText}>
            Drag and drop your Chest X-Ray here, or <span className={styles.highlight}>browse</span>
          </p>
          <p className={styles.uploadHint}>Supports JPG, PNG, DICOM (converted)</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className={styles.hiddenInput}
          />
        </div>
      ) : (
        <div className={styles.previewContainer}>
          <img src={previewUrl} alt="X-Ray Preview" className={styles.previewImage} />
          <div className={styles.actions}>
            <button onClick={clearImage} className={styles.clearBtn} disabled={isAnalyzing}>
              Remove
            </button>
            <button onClick={onAnalyze} className={`${styles.analyzeBtn} ${isAnalyzing ? 'pulse-animation' : ''}`} disabled={isAnalyzing}>
              {isAnalyzing ? 'Analyzing...' : 'Analyze X-Ray'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
