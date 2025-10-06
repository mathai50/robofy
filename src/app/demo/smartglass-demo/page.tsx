'use client';

import { useEffect, useState, useCallback } from 'react';
import './smart-glass.css';

export default function SmartGlassPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [previousSection, setPreviousSection] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const totalSections = 5;

  const navigateToSection = useCallback((sectionIndex: number) => {
    if (sectionIndex >= 0 && sectionIndex < totalSections && sectionIndex !== currentSection && !isAnimating) {
      setPreviousSection(currentSection);
      setIsAnimating(true);
      setDirection(sectionIndex > currentSection ? 'down' : 'up');
      setCurrentSection(sectionIndex);

      // Reset animation state after transition completes
      setTimeout(() => {
        setIsAnimating(false);
        setPreviousSection(null);
      }, 1290);
    }
  }, [currentSection, isAnimating, totalSections]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isAnimating) return;

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          navigateToSection(currentSection + 1);
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          navigateToSection(currentSection - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentSection, isAnimating, navigateToSection]);

  return (
    <div className="smart-glass-container">
      {/* Navigation Pills */}
      <div className="fixed top-12 right-12 z-50">
        <div className="flex flex-col gap-3">
          {Array.from({ length: totalSections }, (_, i) => (
            <button
              key={i}
              onClick={() => navigateToSection(i)}
              className={`nav-pill w-4 h-4 rounded-full ${
                currentSection === i
                  ? 'bg-white active'
                  : 'bg-white/50'
              }`}
              disabled={isAnimating}
            />
          ))}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className={`fixed top-12 left-12 z-50`}>
        <div className="flex gap-3">
          <button className="fab-button px-6 py-3 bg-white/70 backdrop-blur-lg text-black rounded-full font-semibold border border-white/30">
            Order Now
          </button>
          <button className="fab-button px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-full font-semibold">
            Features
          </button>
        </div>
      </div>

      {/* Sections Container with Zoom Effect */}
      <div className={`zoom-wrapper ${isAnimating ? 'animating' : ''}`}>
        <div
          className="sections-container"
          style={{
            transform: `translateY(-${currentSection * 100}vh)`
          }}
        >
        {/* Section 1: Hero - Lime Green */}
        <section className="smart-section section-1">
          <div className="morphing-blob">
            <svg className="blob-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
              <path className="blob-path" />
            </svg>
          </div>
          <div className="particles-container">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
          <div className="text-overlay" style={{ bottom: '180px' }}>
            <h1 className="text-[2.5vw] md:text-[3vw] uppercase text-white mb-6">
              VISION REDEFINED.
            </h1>
            <p className="text-[1.5vw] md:text-[1.8vw] text-white mb-8">
              Revolutionary eyewear that adapts to your lifestyle
            </p>
            <button className="cta-button bg-white/70 backdrop-blur-lg text-black px-[2.5vw] py-[0.8vw] rounded-full text-[1.2vw] md:text-[1.5vw] hover:scale-105 transition-all duration-300 border border-white/30">
              Order Now
            </button>
          </div>
        </section>

        {/* Section 2: Features - Tangerine Orange */}
        <section className="smart-section section-2">
          <div className="morphing-blob">
            <svg className="blob-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
              <path className="blob-path" />
            </svg>
          </div>
          <div className="particles-container">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
          <div className="text-overlay" style={{ bottom: '180px' }}>
            <h2 className="text-[2.5vw] md:text-[3vw] font-black text-white uppercase mb-4">
              SMART. ADAPTABLE. EFFORTLESS.
            </h2>
            <p className="text-[1.5vw] md:text-[1.8vw] text-white/90 mb-8">
              Advanced technology meets seamless design
            </p>
          </div>
        </section>

        {/* Section 3: Privacy - Lemon Yellow */}
        <section className="smart-section section-3">
          <div className="morphing-blob">
            <svg className="blob-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
              <path className="blob-path" />
            </svg>
          </div>
          <div className="particles-container">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
          <div className="text-overlay" style={{ bottom: '180px' }}>
            <h2 className="text-[2.5vw] md:text-[3vw] text-white uppercase mb-6">
              ALWAYS ON, ALWAYS PRIVATE.
            </h2>
            <p className="text-[1.5vw] md:text-[1.8vw] text-white mb-8">
              Local AI, zero cloud. Your moments, your data.
            </p>
          </div>
        </section>

        {/* Section 4: Fit - Pool Blue */}
        <section className="smart-section section-4">
          <div className="morphing-blob">
            <svg className="blob-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
              <path className="blob-path" />
            </svg>
          </div>
          <div className="particles-container">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
          <div className="text-overlay" style={{ bottom: '180px' }}>
            <h2 className="text-[2.5vw] md:text-[3vw] uppercase mb-6 text-white">
              FIT. LIGHT. FASHION-DRIVEN.
            </h2>
            <p className="text-[1.5vw] md:text-[1.8vw] text-white mb-8">
              Ultra-lightweight design meets contemporary style
            </p>
          </div>
        </section>

        {/* Section 5: Social Proof / CTA - Bright Pink */}
        <section className="smart-section section-5">
          <div className="morphing-blob">
            <svg className="blob-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
              <path className="blob-path" />
            </svg>
          </div>
          <div className="particles-container">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
          <div className="text-overlay" style={{ bottom: '180px' }}>
            <h2 className="text-[2.5vw] md:text-[3vw] font-black text-white uppercase mb-6">
              INTELLIGENCE AMPLIFIED.
            </h2>
            <div className="mb-12">
              <blockquote className="text-[1.5vw] md:text-[1.8vw] text-white">
                "The perfect blend of fashion and function. I wear them everywhere."
              </blockquote>
            </div>
            <button className="cta-button bg-white/70 backdrop-blur-lg text-black px-[3vw] py-[1.2vw] rounded-full text-[1.2vw] md:text-[1.5vw] hover:scale-110 transition-all duration-300 shadow-2xl border border-white/30">
              Order Now
            </button>
          </div>
        </section>
        </div>
      </div>
    </div>
  );
}