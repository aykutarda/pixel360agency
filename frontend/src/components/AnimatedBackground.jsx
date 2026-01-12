import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      time += 0.005;
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Pixelated grid
      const gridSize = 40;
      ctx.strokeStyle = 'rgba(230, 255, 0, 0.03)';
      ctx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const pulse = Math.sin(time + x * 0.01 + y * 0.01) * 0.5 + 0.5;
          ctx.strokeStyle = `rgba(230, 255, 0, ${0.02 + pulse * 0.03})`;
          ctx.strokeRect(x, y, gridSize, gridSize);
        }
      }

      // Floating particles
      for (let i = 0; i < 30; i++) {
        const x = (Math.sin(time * 0.3 + i * 0.5) * 0.5 + 0.5) * canvas.width;
        const y = (Math.cos(time * 0.2 + i * 0.7) * 0.5 + 0.5) * canvas.height;
        const size = Math.sin(time + i) * 2 + 3;
        const alpha = Math.sin(time * 2 + i) * 0.3 + 0.4;
        
        ctx.fillStyle = `rgba(230, 255, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Glowing orbs
      const gradient1 = ctx.createRadialGradient(
        canvas.width * 0.2, canvas.height * 0.3, 0,
        canvas.width * 0.2, canvas.height * 0.3, 300
      );
      gradient1.addColorStop(0, 'rgba(230, 255, 0, 0.1)');
      gradient1.addColorStop(1, 'rgba(230, 255, 0, 0)');
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gradient2 = ctx.createRadialGradient(
        canvas.width * 0.8, canvas.height * 0.7, 0,
        canvas.width * 0.8, canvas.height * 0.7, 400
      );
      gradient2.addColorStop(0, 'rgba(147, 51, 234, 0.08)');
      gradient2.addColorStop(1, 'rgba(147, 51, 234, 0)');
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
};

export default AnimatedBackground;
