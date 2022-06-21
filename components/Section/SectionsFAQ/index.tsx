import React, { useState, useRef, useEffect } from 'react';
import { usePrevious } from '../../../hooks/utils';
import s from './style.module.scss';
import cN from 'classnames';

type FAQProps = {
  question: string | null;
  answer: string | null;
  openInitially: boolean;
};

export const FAQ = ({ question, answer, openInitially = false }: FAQProps) => {
  const [isOpen, setIsOpen] = useState(openInitially);
  const [isAnimating, setIsAnimating] = useState(false);
  const [containerHeight, setContainerHeight] = useState<string | undefined>();
  const answerEl = useRef(null);
  const prevIsOpen = usePrevious(isOpen);

  useEffect(() => {
    if (isOpen && prevIsOpen !== undefined) {
      setIsAnimating(true);
      setContainerHeight(0);
      setTimeout(() => {
        if (answerEl.current && answerEl.current.offsetHeight) {
          setContainerHeight(answerEl.current.offsetHeight + 'px');
        }

        setTimeout(() => {
          setContainerHeight(undefined);
          setIsAnimating(false);
        }, 500);
      });
    }
    if (!isOpen && prevIsOpen !== undefined) {
      setIsAnimating(true);
      setTimeout(() => {
        setContainerHeight(answerEl.current.offsetHeight + 'px');
        setTimeout(() => {
          setContainerHeight(0);
          setTimeout(() => {
            setContainerHeight(undefined);
            setIsAnimating(false);
          }, 300);
        }, 10);
      }, 10);
    }
  }, [isOpen]);

  if (question && answer) {
    return (
      <div className={s.questionAndAnswer}>
        <button
          className={cN(s.question, { [s.open]: isOpen })}
          onClick={() => setIsOpen(!isOpen)}
        >
          {question.question}
        </button>
        <div
          className={cN(s.answerContainer, {
            [s.open]: isOpen && !isAnimating,
            [s.closed]: !isOpen && !isAnimating,
            [s.animating]: isAnimating,
          })}
          style={{ height: containerHeight }}
        >
          <div className={s.answer} ref={answerEl}>
            {contentfulJsonToHtml(answer)}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
