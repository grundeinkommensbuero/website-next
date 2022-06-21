import React, { useState, useRef, useEffect } from 'react';
import { usePrevious } from '../../hooks/utils';
import parseHTML from 'html-react-parser';
import s from './style.module.scss';
import cN from 'classnames';
import MinusIcon from './minus-icon.svg';
import PlusIcon from './plus-icon.svg';

type FAQProps = {
  question: string | null;
  answer: string | null;
  openInitially: boolean;
};

export const FAQ = ({ question, answer, openInitially = false }: FAQProps) => {
  const [isOpen, setIsOpen] = useState(openInitially);
  const [isAnimating, setIsAnimating] = useState(false);
  const [containerHeight, setContainerHeight] = useState<string | undefined>();
  const answerEl = useRef<HTMLDivElement>(null);
  const prevIsOpen = usePrevious(isOpen);

  useEffect(() => {
    if (isOpen && prevIsOpen !== undefined) {
      setIsAnimating(true);
      setContainerHeight('0');
      setTimeout(() => {
        setContainerHeight(answerEl.current?.offsetHeight + 'px');

        setTimeout(() => {
          setContainerHeight(undefined);
          setIsAnimating(false);
        }, 500);
      });
    }
    if (!isOpen && prevIsOpen !== undefined) {
      setIsAnimating(true);
      setTimeout(() => {
        setContainerHeight(answerEl.current?.offsetHeight + 'px');
        setTimeout(() => {
          setContainerHeight('0');
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
          {question}
          {isOpen ? (
            <MinusIcon />
          ) : (
            <PlusIcon />
          )}
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
            {parseHTML(answer)}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
