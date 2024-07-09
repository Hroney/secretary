import React from 'react';
import Calendar from 'react-calendar';
import { addMonths, subYears } from 'date-fns';
import isSameDay from '../../helpers/isSameDay';

const CalendarComponent = ({ value, onChange, schedule }) => {


    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const scheduledItems = schedule.filter(item =>
                isSameDay(new Date(item.scheduled_date), date)
            );
            return (
                <div style={{ color: scheduledItems.length > 0 ? "green" : "transparent" }}>
                    {scheduledItems.length > 0 ? '✓' : 'x'}
                </div>
            );
        }
    };

    const minDate = subYears(new Date(), 1);
    const maxDate = addMonths(new Date(), 1);

    return (
        <Calendar
            onChange={onChange}
            value={value}
            tileContent={tileContent}
            minDate={minDate}
            maxDate={maxDate}
        />
    );
};

export default CalendarComponent;
