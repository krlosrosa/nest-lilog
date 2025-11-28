import { Duration } from 'luxon';

export function timeToSecondsLuxon(time: string): number {
  if (!time || time === '00:00:00' || time === '') return 0;
  const [hms, ms] = time.split('.');
  const [hours, minutes, seconds] = hms.split(':').map(Number);
  const millis = ms ? parseInt(ms, 10) : 0;

  const duration = Duration.fromObject({
    hours,
    minutes,
    seconds,
    milliseconds: millis,
  });

  return duration.as('seconds');
}
