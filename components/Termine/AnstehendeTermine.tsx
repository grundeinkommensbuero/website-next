import { useEffect, useState } from 'react';
import { CTALink } from '../Forms/CTAButton';

type AnstehendeTermineProps = {
  listAll: boolean;
};

type Event = {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  location?: string;
};

export default function AnstehendeTermine({ listAll }: AnstehendeTermineProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // 02
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 09
    return `${day}.${month}.`;
  };
  const formatLongDate = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const dayMonth = startDate.toLocaleDateString('de-DE', {
      day: 'numeric',
      month: 'long',
    });

    const startTime = startDate.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const endTime = endDate.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${dayMonth}, ${startTime}-${endTime} Uhr`;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${
            process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID
          }/events?key=${
            process.env.NEXT_PUBLIC_GOOGLE_API_KEY
          }&orderBy=startTime&singleEvents=true&timeMin=${new Date().toISOString()}`
        );

        const data = await res.json();
        setEvents(data.items || []);
      } catch (err) {
        console.error('Failed to fetch Google Calendar events', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <p>Loading events…</p>;

  return (
    <div className="space-y-6">
      {events.length === 0 ? (
        <p>Keine bevorstehenden Termine</p>
      ) : (
        (listAll ? events : events.slice(0, 3)).map(event => (
          <div key={event.id} className="p-4 border rounded-xl shadow-md">
            <h4>
              <b>
                {event.start.dateTime
                  ? `${formatShortDate(event.start.dateTime)}: ${event.summary}`
                  : `${event.start.date}: ${event.summary}`}
              </b>
            </h4>
            {event.description && (
              <p
                className="text-sm"
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            )}
            <p>
              🗓{' '}
              {event.start.dateTime &&
                event.end.dateTime &&
                formatLongDate(event.start.dateTime, event.end.dateTime)}
            </p>

            {event.location && <p>📍 {event.location}</p>}
          </div>
        ))
      )}
      {!listAll && (
        <CTALink to={'/anstehende-termine'}>Alle anstehenden Termine</CTALink>
      )}
    </div>
  );
}
