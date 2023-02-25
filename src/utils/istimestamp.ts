/* eslint-disable prettier/prettier */
export function isTimeStamp(time: string) {
  let isSecondTimeStamp = false;
  if (time.length === 13) isSecondTimeStamp = true;
  const timeToNumber = typeof time === 'string' ? Number(time) : time;
  const timestamp = isSecondTimeStamp
    ? new Date(timeToNumber).getTime() / 1000
    : new Date(timeToNumber).getTime();
  return timeToNumber === timestamp;
}
