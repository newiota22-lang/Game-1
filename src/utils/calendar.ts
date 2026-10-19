/**
 * Calendar utilities to export ICS reminders and Google Calendar links
 * for Pancasila assignments and weekly class missions
 */

export interface CalendarEventData {
  title: string;
  description: string;
  location?: string;
  startDate: Date;
  durationMinutes: number;
}

export function generateGoogleCalendarUrl(event: CalendarEventData): string {
  const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
  const formatTime = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

  const start = formatTime(event.startDate);
  const endDate = new Date(event.startDate.getTime() + event.durationMinutes * 60000);
  const end = formatTime(endDate);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    location: event.location || 'Kelas 4 SD - Petualangan Garuda Pancasila',
    dates: `${start}/${end}`
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcsFile(event: CalendarEventData, filename = 'jadwal-pancasila.ics') {
  const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
  const formatTime = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;

  const start = formatTime(event.startDate);
  const endDate = new Date(event.startDate.getTime() + event.durationMinutes * 60000);
  const end = formatTime(endDate);
  const now = formatTime(new Date());

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Garuda Pancasila 3D//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:pancasila-${Date.now()}@sekolah.id`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location || 'Kelas 4 SD'}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
