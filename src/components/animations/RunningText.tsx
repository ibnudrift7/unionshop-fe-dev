'use client';

import { useEffect, useRef } from 'react';

interface RunningTextProps {
  text: string;
  className?: string;
  speed?: number;
}

export default function RunningText({
  text,
  className = '',
  speed = 50,
}: RunningTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const textElement = textRef.current;
    if (!container || !textElement) return;

    const textWidth = textElement.offsetWidth;

    // duration in seconds based on px/s speed
    const duration = Math.max(8, textWidth / speed);

    if (trackRef.current) {
      trackRef.current.style.setProperty('--duration', `${duration}s`);
    }

    return () => {
      textElement.style.animation = '';
    };
  }, [text, speed]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden whitespace-nowrap ${className}`}
    >
      <style jsx>{`
        :global(.running-track) {
          display: inline-block;
          white-space: nowrap;
        }
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      <div
        ref={trackRef}
        className={`running-track inline-block ${className}`}
        style={{
          // duration set dynamically via CSS var
          animation: 'scroll-left var(--duration) linear infinite',
        }}
      >
        <div ref={textRef} className='inline-block pr-6'>
          {text}
        </div>
        <div className='inline-block pr-6'>{text}</div>
      </div>
    </div>
  );
}
