import { startOfDay, differenceInCalendarDays } from 'date-fns';

const isSameDay = (a, b) => {
    return differenceInCalendarDays(startOfDay(a), startOfDay(b)) === 0;
};

export default isSameDay;