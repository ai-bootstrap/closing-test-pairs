import dayjs from "dayjs";


export function getDaysDifference(time:Date | string) {
  const now = dayjs();
  const inputDate = dayjs(time);
  return now.diff(inputDate, 'day');
}