import React, { useEffect, useState } from 'react';
import s from './style.module.scss';
import * as dsm from './utils/dateStringManipulation';
import { LoadingAnimation } from '../LoadingAnimation';
import { LinkButtonLocal } from '../Forms/Button';
import { formatDateShortIso } from '../../utils/date';
import { Location } from './Map';

/* The "EventsListed" Component should only display data,
when there were events in the next days.

Otherwise it renders nothing. */

type GroupedEvents = {
  [date: string]: Location[];
};

export const EventsListed = ({
  locationsFiltered,
}: {
  locationsFiltered?: Location[];
}) => {
  const [loading, setLoading] = useState(false);
  const [groupedEvents, setGroupedEvents] = useState<GroupedEvents>({});

  useEffect(() => {
    if (locationsFiltered) {
      setLoading(true);
      const locationsSorted = locationsFiltered
        ?.filter(location => location.startTime && location.endTime)
        .sort(function (a, b) {
          return (
            new Date(a.startTime!).getTime() - new Date(b.startTime!).getTime()
          );
        });
      const grouped = groupByDate(locationsSorted);
      setGroupedEvents(grouped);
      setLoading(false);
    }
  }, [locationsFiltered]);

  const groupByDate = (locations: Location[]) => {
    const grEvents: GroupedEvents = {};
    locations.forEach(location => {
      const eventDate = dsm.getGermanDateFormat(location.startTime);
      if (!(eventDate in grEvents)) grEvents[eventDate] = [];
      grEvents[eventDate].push(location);
    });
    return grEvents;
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <>
      {Object.keys(groupedEvents).length > 0 ? (
        <>
          <h2 className={s.moduleHeading}>Komm zu einer Sammelaktion</h2>
          <div className={s.eventContainer}>
            {Object.keys(groupedEvents).map(key => {
              return (
                <div key={key} className={s.eventDay}>
                  <h3 className={s.descriptionHeading}>
                    {dsm.getDateWithWeekday(groupedEvents[key][0].startTime)}
                  </h3>
                  {groupedEvents[key].map((event, index) => {
                    return (
                      <div key={index} className={s.eventDescription}>
                        <div className={s.descriptionText}>
                          <p>{event.description}</p>
                          <p>Kontakt: {event.contact}</p>
                        </div>

                        <p>
                          <b>
                            {dsm.localeTime(event.startTime)}-
                            {dsm.localeTime(event.endTime)}
                            {' Uhr, '}
                            {event.address || event.locationName}
                          </b>
                        </p>

                        <LinkButtonLocal
                          to={`/sammeln/anmelden?location=${
                            event.address || event.locationName
                          }&date=${formatDateShortIso(
                            new Date(event.startTime!)
                          )}`}
                          target="_blank"
                        >
                          Für Event anmelden
                        </LinkButtonLocal>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </>
      ) : null}
    </>
  );
};
