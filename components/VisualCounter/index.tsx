import React, { useState, useEffect, useRef } from 'react';

const INTERVALL = 50;

const VisualCounter = ({ end = 0, start = 0, time = 1000 }) => {
  const [displayCount, setDisplayCount] = useState(start);

  const prevEndRef = useRef(0);
  useEffect(() => {
    prevEndRef.current = end;
  });
  const prevEnd = prevEndRef.current;

  useEffect(() => {
    const startFrom = prevEnd || start;
    const distance = end - startFrom;
    if (end !== displayCount) {
      const rounds = Math.round(time / INTERVALL);
      for (let round = 0; round <= rounds; round++) {
        setTimeout(() => {
          setDisplayCount(Math.round((round / rounds) * distance) + startFrom);
        }, (round / rounds) * time);
      }
    }
    // eslint-disable-next-line
  }, [end]);

  return <>{displayCount.toLocaleString('de')}</>;
};

export default VisualCounter;
