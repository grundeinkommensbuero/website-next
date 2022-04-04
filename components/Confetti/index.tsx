import React, { useRef, useEffect, useState } from 'react';
import s from './style.module.scss';
import cN from 'classnames';
let canvasConfetti: any;

if (!process.env.STATIC) {
  canvasConfetti = require('canvas-confetti');
}

const themes = [
  {
    name: 'default',
    shapes: ['circle', 'square'],
    gravity: 1,
    ticks: 400,
    spreads: [55, 55, 180],
    colors: [
      '#ff4664',
      '#46b4b4',
      '#3423f6',
      '#e5b5c8',
      '#7d69f6',
      '#fff',
      '#f5f5f5',
    ],
    origins: [
      { x: 0, y: 0.25 },
      { x: 1, y: 0.25 },
      { x: 0.5, y: 0 },
    ],
    angles: [60, 120, 270],
    velocities: [45, 45, 20],
  },
  {
    name: 'christmas',
    shapes: ['circle'],
    gravity: 0.4,
    ticks: 800,
    spreads: [160, 160, 160],
    colors: ['#fefefe', '#ffffff', '#fafdff', '#fafeff'],
    origins: [
      { x: 0.2, y: -0.1 },
      { x: 0.8, y: -0.1 },
      { x: 0.5, y: -0.1 },
    ],
    angles: [120, 120, 120],
    velocities: [20, 20, 20],
  },
];

const Confetti = ({ className, componentTheme = 'default' }: any) => {
  let theme = themes.find(t => t.name === componentTheme);
  if (!theme) {
    theme = themes[0];
  }
  const canvas = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [confetti, setConfetti] = useState<any>({});
  let animating = true;

  useEffect(() => {
    const confetti = canvasConfetti.create(canvas.current, {
      resize: true,
      useWorker: true,
    });
    setConfetti({ confetti: confetti });
  }, [setConfetti]);

  useEffect(() => {
    return () => {
      if (confetti.confetti) {
        confetti.confetti.reset();
      }
    };
  }, [confetti]);

  useEffect(() => {
    if (canvas && confetti.confetti) {
      const frame = () => {
        if (isInView && Math.random() < 0.2 && theme) {
          if (window.innerWidth > 600) {
            confetti.confetti({
              disableForReducedMotion: true,
              particleCount: 1,
              angle: theme.angles[0],
              startVelocity: theme.velocities[0],
              spread: theme.spreads[0],
              origin: theme.origins[0],
              gravity: theme.gravity,
              shapes: theme.shapes,
              colors: [
                ...theme.colors[
                  Math.round(Math.random() * (theme.colors.length - 1))
                ],
              ],
              ticks: theme.ticks,
            });
            confetti.confetti({
              disableForReducedMotion: true,
              particleCount: 1,
              angle: theme.angles[1],
              startVelocity: theme.velocities[1],
              spread: theme.spreads[1],
              origin: theme.origins[1],
              gravity: theme.gravity,
              shapes: theme.shapes,
              colors: [
                ...theme.colors[
                  Math.round(Math.random() * (theme.colors.length - 1))
                ],
              ],
              ticks: theme.ticks,
            });
          } else {
            confetti.confetti({
              disableForReducedMotion: true,
              particleCount: 1,
              angle: theme.angles[2],
              startVelocity: theme.velocities[2],
              spread: theme.spreads[2],
              origin: theme.origins[2],
              gravity: theme.gravity,
              shapes: theme.shapes,
              colors: [
                ...theme.colors[
                  Math.round(Math.random() * (theme.colors.length - 1))
                ],
              ],
              ticks: theme.ticks,
            });
          }
        }
        if (animating && isInView) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }

    return () => {
      // eslint-disable-next-line
      animating = false;
    };
  }, [isInView, confetti]);

  useEffect(() => {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setIsInView(true);
            } else {
              setIsInView(false);
            }
          });
        },
        {
          threshold: 0.1,
        }
      );
      observer.observe(canvas.current as any);
    } else {
      setIsInView(true);
    }
  }, [setIsInView]);

  // eslint-disable-next-line jsx-a11y/control-has-associated-label
  return <canvas ref={canvas} className={cN(className, s.canvas)} />;
};

export default Confetti;
