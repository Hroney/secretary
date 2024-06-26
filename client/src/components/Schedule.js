import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import redirectCheck from '../helpers/redirectCheck';
import Calendar from 'react-calendar';
import { startOfDay, differenceInCalendarDays, addMonths, subYears } from 'date-fns';
import 'react-calendar/dist/Calendar.css';

const isSameDay = (a, b) => {
    return differenceInCalendarDays(startOfDay(a), startOfDay(b)) === 0;
};

function Schedule() {
    const [isLoggedIn, setIsLoggedIn] = useOutletContext();
    const [schedule, setSchedule] = useState([]);
    const [value, setValue] = useState(new Date());

    useEffect(() => {
        if (isLoggedIn) {
            const userId = localStorage.getItem('userId');
            fetch(`http://localhost:5555/schedule/${userId}`)
                .then(response => response.json())
                .then(data => {
                    setSchedule(data);
                })
                .catch(error => console.error('Error fetching schedule:', error));
        }
    }, [isLoggedIn]);

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const scheduledItems = schedule.filter(item =>
                isSameDay(new Date(item.scheduled_date), date)
            );
            if (scheduledItems.length > 0) {
                return (
                    <div style={{ color: "green" }}>
                        ✓
                    </div>
                );
            } else {
                return (
                    <div style={{ color: "transparent" }}>
                        x
                    </div>
                )
            }
        }
    };

    const onChange = (nextValue) => {
        setValue(nextValue);
    };

    const minDate = subYears(new Date(), 1);
    const maxDate = addMonths(new Date(), 1);

    return (
        <div>
            {!isLoggedIn ? redirectCheck(isLoggedIn) :
                <div>
                    <Calendar
                        onChange={onChange}
                        value={value}
                        tileContent={tileContent}
                        minDate={minDate}
                        maxDate={maxDate}
                    />
                </div>
            }
        </div>
    );
}

export default Schedule;
