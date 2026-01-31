import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ru";
import "dayjs/locale/en";

export type Locale = 'en' | 'ru' | 'fr';

dayjs.extend(relativeTime);

export function formatPostDate(isoDate: string, locale: Locale = "en"): string {
  dayjs.locale(locale);
  return dayjs(isoDate).fromNow();
}
