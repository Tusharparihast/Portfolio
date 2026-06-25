import { useEffect, useRef } from 'react';

export default function BubbleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Track full scrollable document height instead of just the viewport window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
        window.innerHeight
      );
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    // Listen for route or layout shifts that might mutate document dimensions
    window.addEventListener('scroll', resizeCanvas);

    // Initialize Particle Arrays
    const bubbleCount = 45; // Adjust count depending on desired density
    const bubbles = [];

    class Bubble {
      constructor() {
        this.x = Math.random() * canvas.width;
        // Distribute bubbles vertically across the initial canvas canvas state
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 15 + 4; // Varying bubble radii
        this.speedY = Math.random() * 0.6 + 0.2; // Speed up-drift
        this.wobbleSpeed = Math.random() * 0.02 + 0.005;
        this.wobbleDistance = Math.random() * 2 + 0.5;
        this.angle = Math.random() * Math.PI * 2;
        // Subtle blue transparency profile matching standard design specs
        this.opacity = Math.random() * 0.15 + 0.05; 
      }

      update() {
        this.y -= this.speedY; // Move upward
        this.angle += this.wobbleSpeed;
        this.x += Math.sin(this.angle) * 0.15; // Horizontal drift wave mutation

        // Reset bubble position to the bottom once it floats off the top boundary frame
        if (this.y + this.radius < 0) {
          this.y = canvas.height + this.radius;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37, 99, 235, ${this.opacity})`; // Transparent Tailwind Blue-600
        ctx.fill();
      }
    }

    // Populate Matrix Array
    for (let i = 0; i < bubbleCount; i++) {
      bubbles.push(new Bubble());
    }

    // Canvas Frame Core Loop
    const renderLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      bubbles.forEach((bubble) => {
        bubble.update();
        bubble.draw();
      });

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute top-0 left-0 w-full pointer-events-none z-0"
      style={{ mixBlendMode: 'multiply' }} 
    />
  );
}