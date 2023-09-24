import React, { useState, useRef, useEffect, ReactElement } from 'react';
import s from './style.module.scss';
import cN from 'classnames';
import { LinkButtonLocal, LinkButton } from '../Forms/Button';
import { useSignatureCount } from '../../hooks/Api/Signatures/Get';
import eyeCatcherBackground from '!svg-inline-loader!./eye_catcher.svg';
import { Tooltip } from '../Tooltip';
import VisualCounter from '../VisualCounter';
import { formatDateMonthYear } from './formatDateMonthYear';
// import { useGetCrowdfundingDirectly } from '../../hooks/Api/Crowdfunding';
import parseHTML from 'html-react-parser';
import Link from 'next/link';

export type CampaignVisualisation = {
  id: string;
  title: string;
  startDate: string;
  campaignCode: string;
  hint: string;
  goal: number;
  goalInbetweenMultiple: number[] | null;
  goalUnbuffered: number | null;
  maximum: number | null;
  minimum: number | null;
  addToSignatureCount: number | null;
  startnextId?: string;
  ctaLink?: string;
  project?: string;
};

type CampaignVisualisationsProps = {
  visualisations?: CampaignVisualisation[];
  triggerUpdate?: number;
};

const CampaignVisualisations = ({
  visualisations,
  triggerUpdate,
}: CampaignVisualisationsProps) => {
  const [currentCounts, refetchCount] = useSignatureCount();

  useEffect(() => {
    if (triggerUpdate) {
      refetchCount();
    }
  }, [triggerUpdate]);

  if (!visualisations) {
    return null;
  }

  return (
    <>
      {visualisations.map((visualisation, index) => {
        if (visualisation.campaignCode) {
          return (
            <CampaignVisualisation
              key={index}
              index={index}
              currentCount={
                currentCounts &&
                currentCounts[visualisation.campaignCode] &&
                currentCounts[visualisation.campaignCode].computed
              }
              receivedCount={
                currentCounts &&
                currentCounts[visualisation.campaignCode] &&
                currentCounts[visualisation.campaignCode].withMixed
              }
              showCTA={!!(visualisations.length !== 1 && visualisation.ctaLink)}
              labels={{
                NEEDED: () => <>Benötigte Unterschriften</>,
                GOAL_INBETWEEN_TOOLTIP: (count: string) => (
                  <>
                    Insgesamt benötigt:
                    <br />
                    {count} Unterschriften
                  </>
                ),
                GOAL_INBETWEEN: (count: string) => (
                  <>Nächstes Ziel: {count} Unterschriften</>
                ),
                CURRENT_COUNT: () => <>Gesammelte Unterschriften</>,
                CTA: () => <>Mitmachen</>,
              }}
              onWhiteBackground={visualisation.campaignCode === 'democracy-1'}
              {...visualisation}
            />
          );
        }
        // if (visualisation.startnextId) {
        //   return <CrowdFundingVisualistation key={index} {...props} />;
        // }
        return null;
      })}
    </>
  );
};

// type CrowdFundingVisualistationProps = {
//   startnextId?: string;
//   visualisation: CampaignVisualisation;
// };

// export const CrowdFundingVisualistation = ({
//   startnextId,
//   ...props
// }: CrowdFundingVisualistationProps) => {
//   // Check visualisation includes a project key
//   const hasProjectProp = visualisation.hasOwnProperty('project');

//   // If visualisation does not include project key, query startnext
//   const [crowdFunding] = !hasProjectProp
//     ? useGetCrowdfundingDirectly(startnextId)
//     : [];

//   // If data is loading
//   if (
//     // Has project property but no value
//     (hasProjectProp && visualisation.project == null) ||
//     // Startnext query in progress in this component
//     (!hasProjectProp && !crowdFunding)
//   ) {
//     return <section>lade...</section>;
//   }

//   // Use the correct project object
//   const crowdfundingProject = hasProjectProp
//     ? visualisation.project
//     : crowdFunding.project;

//   return (
//     <Visualisation
//       goal={crowdfundingProject.funding_target}
//       count={Math.round(crowdfundingProject.funding_status || 0)}
//       startDate={crowdfundingProject.start_date}
//       currency="€"
//       currencyShort="€"
//       showCTA={visualisation.ctaLink}
//       labels={{
//         NEEDED: () => <>Benötigte Summe</>,
//         GOAL_INBETWEEN_TOOLTIP: (count: string) => (
//           <>
//             Insgesamt benötigt:
//             <br />
//             {count} €
//           </>
//         ),
//         GOAL_INBETWEEN: count => <>Nächstes Ziel: {count} €</>,
//         CURRENT_COUNT: () => <>Bereits gespendet</>,
//         CTA: () => <>Spenden!</>,
//       }}
//       {...props}
//     />
//   );
// };

type CampaignVisualisationProps = {
  index: number;
  key: number;
  minimum: number | null;
  maximum: number | null;
  addToSignatureCount: number | null;
  currentCount: number | void;
  receivedCount: number | void;
  isCrowdfunding?: boolean;
  onWhiteBackground: boolean;
  showCTA: boolean;
  labels: Labels;
  goal: number;
  startDate: string;
  currency?: string;
  currencyShort?: string;
};

export const CampaignVisualisation = ({
  minimum,
  maximum,
  addToSignatureCount,
  currentCount,
  receivedCount,
  isCrowdfunding = false,
  onWhiteBackground = false,
  showCTA,
  ...props
}: CampaignVisualisationProps) => {
  let count = currentCount || 0;

  if (addToSignatureCount) {
    count += addToSignatureCount;
  }

  if (minimum) {
    count = Math.max(count, minimum);
  }

  if (maximum) {
    count = Math.min(count, maximum);
  }

  return (
    <Visualisation
      count={count}
      isCrowdfunding={isCrowdfunding}
      onWhiteBackground={onWhiteBackground}
      showCTA={showCTA}
      {...props}
    />
  );
};

type Labels = {
  NEEDED: () => ReactElement;
  GOAL_INBETWEEN_TOOLTIP: (count: string) => ReactElement;
  GOAL_INBETWEEN: (count: string) => ReactElement;
  CURRENT_COUNT: () => ReactElement;
  CTA: () => ReactElement;
};

type VisualisationProps = {
  goal: number;
  startDate: string;
  title?: string;
  receivedCount?: number;
  showCTA: boolean;
  ctaLink?: string;
  eyeCatcher?: string;
  eyeCatcherLink?: string;
  goalUnbuffered?: number;
  index?: number;
  hint?: string;
  goalInbetweenMultiple?: number[];
  count: number;
  currency?: string;
  currencyShort?: string;
  labels: Labels;
  isCrowdfunding?: boolean;
  onWhiteBackground?: boolean;
};

export const Visualisation = ({
  goal,
  startDate,
  title,
  receivedCount,
  showCTA,
  ctaLink,
  eyeCatcher,
  eyeCatcherLink,
  goalUnbuffered,
  index,
  hint,
  goalInbetweenMultiple,
  count,
  currency,
  currencyShort,
  labels,
  isCrowdfunding,
  onWhiteBackground,
}: VisualisationProps) => {
  const barEl = useRef(null);
  const [isInView, setIsInView] = useState(false);
  let goalInbetween;

  if (goalInbetweenMultiple) {
    const goalInbetweenMultipleSorted = goalInbetweenMultiple
      .map(goal => (typeof goal === 'string' ? parseInt(goal) : goal))
      .sort((next, prev) => next - prev)
      .reverse();

    goalInbetween = goalInbetweenMultipleSorted.find((goal, index) => {
      if (!goalInbetweenMultipleSorted[index + 1]) {
        return goalInbetweenMultipleSorted[0] > count;
      }
      return count < goal && count > goalInbetweenMultipleSorted[index + 1];
    });
  }
  const EyeCatcherContent = eyeCatcher && parseHTML(eyeCatcher);

  // const goalInbetweenPercentage = goalInbetween && (goalInbetween / goal) * 100;

  useEffect(() => {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setIsInView(true);
            }
          });
        },
        {
          threshold: 1.0,
        }
      );

      if (barEl.current) observer.observe(barEl.current);
    } else {
      setIsInView(true);
    }
  }, []);

  const dateString = startDate
    ? formatDateMonthYear(new Date(startDate))
    : undefined;
  const hasStarted = startDate
    ? new Date().getTime() > new Date(startDate).getTime()
    : true;

  const hintWithVariables = replaceVariablesHintText({
    hint: hint || '',
    goal,
    goalInbetween,
    count,
    receivedCount,
    goalUnbuffered,
  });

  const percentage =
    count && isInView
      ? Math.max(Math.min((count / (goalInbetween || goal)) * 100, 100), 3)
      : 0;
  const countOutside = percentage < 50;
  const goalHasBeenReached = percentage >= 100;

  const barGoalWidth = Math.min(100, ((goalInbetween || goal) / count) * 100);

  const eyeCatcherLinkToDisplay = eyeCatcherLink
    ? eyeCatcherLink
    : showCTA && ctaLink;

  return (
    <section
      className={cN({ [s.sectionInnerHasEyeCatcher]: !!EyeCatcherContent })}
    >
      {/* Not currently needed */}
      {/* {title && <h3 className={s.title}>{title}</h3>} */}

      <div
        className={cN(s.body, { [s.showCTA]: showCTA })}
        style={{ zIndex: index }}
      >
        <div className={s.bar} ref={barEl}>
          <WrapInLink link={showCTA && ctaLink ? ctaLink : ''}>
            <span
              className={cN(s.barGoal, { [s.hasNotStarted]: !hasStarted })}
              aria-hidden="true"
              style={{ width: `${barGoalWidth || 100}%` }}
            >
              <div
                className={cN(
                  s.barGoalBar,
                  { [s.crowdfunding]: isCrowdfunding },
                  { [s.onWhiteBackground]: onWhiteBackground }
                )}
              >
                {/* NOTE by Vali: Is this still needed? Seems kinda unfinished or specifically written
                for crowdfunding */}
                {/* {hasStarted && (
                  // <div
                  //   className={cN(
                  //     s.barGoalInbetween,
                  //     { [s.crowdfunding]: isCrowdfunding },
                  //     { [s.onWhiteBackground]: onWhiteBackground }
                  //   )}
                  //   style={{ width: `${goalInbetweenPercentage || 100}%` }}
                  // ></div>
                )} */}
              </div>
              {goal && !goalInbetween && (
                <Tooltip
                  className={cN(s.goal, { [s.crowdfunding]: isCrowdfunding })}
                  content={labels.NEEDED()}
                >
                  <>
                    {goal.toLocaleString('de')}
                    {currencyShort}
                  </>
                </Tooltip>
              )}
              {goalInbetween && (
                <Tooltip
                  className={cN(s.goal, { [s.crowdfunding]: isCrowdfunding })}
                  content={labels.GOAL_INBETWEEN_TOOLTIP(
                    goal.toLocaleString('de')
                  )}
                >
                  {labels.GOAL_INBETWEEN(goalInbetween.toLocaleString('de'))}
                </Tooltip>
              )}
            </span>
            <>
              {hasStarted && (
                <>
                  <span
                    className={cN(
                      s.barCurrent,
                      { [s.onWhiteBackground]: onWhiteBackground },
                      { [s.outside]: countOutside },
                      {
                        [s.completed]: goalHasBeenReached && !onWhiteBackground,
                      }
                    )}
                    style={{ width: `${percentage}%` }}
                    aria-label={`${count} von ${goal} ${currency}`}
                  >
                    <Tooltip
                      content={labels.CURRENT_COUNT()}
                      className={s.barCurrentLabel}
                      placement="bottom"
                    >
                      <>
                        {count && <VisualCounter end={isInView ? count : 0} />}
                        {currencyShort}
                      </>
                    </Tooltip>
                  </span>
                </>
              )}
              {startDate && !hasStarted && (
                <span
                  aria-label={`Noch nicht gestartet. Ziel: ${goal}${currency}. Startet ${dateString}.`}
                  className={s.starts}
                >
                  {dateString}
                </span>
              )}
            </>
          </WrapInLink>
        </div>
        {showCTA && ctaLink && !ctaLink.startsWith('http') && (
          <LinkButtonLocal size="MEDIUM" className={s.cta} to={ctaLink}>
            {labels.CTA()}
          </LinkButtonLocal>
        )}
        {showCTA && ctaLink && ctaLink.startsWith('http') && (
          <LinkButton
            size="MEDIUM"
            className={s.cta}
            href={ctaLink}
            target="_blank"
          >
            {labels.CTA()}
          </LinkButton>
        )}
        {EyeCatcherContent && (
          <div
            className={cN(s.eyeCatcher, {
              [s.eyeCatcherWithCta]: showCTA && ctaLink,
            })}
          >
            <WrapInLink
              link={eyeCatcherLinkToDisplay || ''}
              className={s.eyeCatcherLink}
            >
              <div
                className={s.eyeCatcherBackground}
                dangerouslySetInnerHTML={{ __html: eyeCatcherBackground }}
                aria-hidden="true"
              />
              <div className={s.eyeCatcherContent}>{EyeCatcherContent}</div>
            </WrapInLink>
          </div>
        )}
      </div>
      {hintWithVariables && <div className={s.hint}>{hintWithVariables}</div>}
    </section>
  );
};

type ReplaceVariablesHintTextArgs = {
  hint: string;
  goal: number;
  count: number;
  receivedCount?: number;
  goalInbetween?: number;
  goalUnbuffered?: number;
};

function replaceVariablesHintText({
  hint,
  goal,
  count,
  receivedCount,
  goalInbetween,
  goalUnbuffered,
}: ReplaceVariablesHintTextArgs) {
  if (!hint) return undefined;
  const buffer = goal - (goalUnbuffered || 0);
  const expectedToArrive = count - (receivedCount || 0);

  return hint
    .replace(
      /\$GOAL_INBETWEEN/gi,
      goalInbetween ? goalInbetween.toLocaleString('de') : ''
    )
    .replace(
      /\$GOAL_UNBUFFERED/gi,
      goalUnbuffered ? goalUnbuffered.toLocaleString('de') : ''
    )
    .replace(/\$GOAL/gi, goal ? goal.toLocaleString('de') : '')
    .replace(/\$BUFFER/gi, buffer ? buffer.toLocaleString('de') : '')
    .replace(/\$COLLECTED/gi, count ? count.toLocaleString('de') : '')
    .replace(
      /\$RECEIVED/gi,
      receivedCount ? receivedCount.toLocaleString('de') : ''
    )
    .replace(
      /\$EXPECTED/gi,
      expectedToArrive ? expectedToArrive.toLocaleString('de') : ''
    );
}

type WrapLinkProps = {
  link: string;
  children: ReactElement | ReactElement[];
  className?: string;
};

const WrapInLink = ({ link, children, className }: WrapLinkProps) => {
  if (link) {
    if (link.startsWith('http')) {
      return (
        <a href={link} target="_blank" rel="noreferrer" className={className}>
          {children}
        </a>
      );
    } else {
      return (
        <Link href={link} passHref legacyBehavior>
          <span className={className}>{children}</span>
        </Link>
      );
    }
  }
  return <>{children}</>;
};

export default CampaignVisualisations;
