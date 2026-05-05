'use client';

import React from 'react';
import styles from './AnalysisResult.module.css';

interface AnalysisResultProps {
  prediction: 'Normal' | 'Pneumonia' | null;
  confidence: number;
}

export default function AnalysisResult({ prediction, confidence }: AnalysisResultProps) {
  if (!prediction) return null;

  const isPneumonia = prediction === 'Pneumonia';
  const displayConfidence = (confidence * 100).toFixed(1);

  return (
    <div className={`${styles.container} animate-fade-in`}>
      <div className={styles.header}>
        <h3 className={styles.title}>Analysis Complete</h3>
      </div>

      <div className={styles.resultCard}>
        <div className={styles.predictionSection}>
          <p className={styles.label}>Prediction</p>
          <div className={`${styles.badge} ${isPneumonia ? styles.badgeDanger : styles.badgeSuccess}`}>
            {prediction}
          </div>
        </div>

        <div className={styles.confidenceSection}>
          <div className={styles.confidenceHeader}>
            <p className={styles.label}>Confidence Score</p>
            <span className={styles.confidenceValue}>{displayConfidence}%</span>
          </div>
          <div className={styles.progressBarBg}>
            <div 
              className={`${styles.progressBarFill} ${isPneumonia ? styles.fillDanger : styles.fillSuccess}`}
              style={{ width: `${displayConfidence}%` }}
            ></div>
          </div>
        </div>
      </div>

      {isPneumonia && (
        <div className={styles.heatmapPlaceholder}>
          <div className={styles.heatmapOverlay}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.heatmapIcon}>
              <path d="M12 2v20" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>Grad-CAM / Heatmap Placeholder</span>
            <p className={styles.heatmapSubtext}>Shows areas that contributed to the "Pneumonia" classification</p>
          </div>
        </div>
      )}

      <div className={styles.disclaimer}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p><strong>Research Use Only:</strong> This model is a prototype and not a substitute for professional medical diagnosis. Please consult a qualified radiologist or physician for clinical decisions.</p>
      </div>
    </div>
  );
}
