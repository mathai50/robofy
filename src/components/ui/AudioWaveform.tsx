import React, { useEffect, useRef } from 'react';

interface AudioWaveformProps {
  isRecording?: boolean;
  isPlaying?: boolean;
  audioLevel?: number;
  className?: string;
}

export default function AudioWaveform({
  isRecording = false,
  isPlaying = false,
  audioLevel = 0,
  className = ''
}: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRecording && !isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const { width, height } = canvas;
      const barWidth = width / 20;
      const barSpacing = barWidth * 0.2;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw waveform bars
      for (let i = 0; i < 20; i++) {
        const barHeight = Math.random() * height * (0.3 + (audioLevel * 0.7));

        // Color based on state
        if (isRecording) {
          ctx.fillStyle = `rgba(239, 68, 68, ${0.6 + (audioLevel * 0.4)})`; // Red for recording
        } else if (isPlaying) {
          ctx.fillStyle = `rgba(59, 130, 246, ${0.6 + (audioLevel * 0.4)})`; // Blue for playing
        } else {
          ctx.fillStyle = 'rgba(156, 163, 175, 0.5)'; // Gray for idle
        }

        const x = i * (barWidth + barSpacing);
        const y = height - barHeight;

        // Rounded corners for bars
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth * 0.8, barHeight, 2);
        ctx.fill();
      }

      if (isRecording || isPlaying) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, isPlaying, audioLevel]);

  return (
    <div className={`inline-flex items-center ${className}`}>
      <canvas
        ref={canvasRef}
        width={80}
        height={20}
        className="rounded"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
      />
      {(isRecording || isPlaying) && (
        <span className={`ml-2 text-xs font-medium ${
          isRecording ? 'text-red-600' : 'text-blue-600'
        }`}>
          {isRecording ? 'Recording...' : 'Playing...'}
        </span>
      )}
    </div>
  );
}