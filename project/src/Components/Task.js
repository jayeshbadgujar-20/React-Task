import React, { useEffect, useState } from 'react';

const Task = () => {
  const [currentStartDate, setCurrentStartDate] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Kolkata');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('8:00 AM');
  const [timeOptionsByDay, setTimeOptionsByDay] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

  useEffect(() => {
    loadData(currentStartDate);

    const intervalId = setInterval(() => {
      const updatedTime = new Date();
      setCurrentTime(updatedTime);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentStartDate, selectedTimezone]);

  useEffect(() => {
    updateAllTimes();
  }, [currentStartDate, selectedTimezone, selectedTime]);

  const loadData = (startDate) => {
    console.log('Loading data for the week starting from:', startDate);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    const initialTimeOptionsByDay = days.map(() => {
      return Array.from({ length: 16 }, (_, index) => ({
        hour: 8 + index,
        formattedHour: ((8 + index) % 12 || 12).toString().padStart(2, '0'),
        period: 8 + index < 12 ? 'AM' : 'PM',
        isChecked: false,
      }));
    });

    setTimeOptionsByDay(initialTimeOptionsByDay);
  };

  const handlePrevWeek = () => {
    const prevWeekStartDate = new Date(currentStartDate);
    prevWeekStartDate.setDate(prevWeekStartDate.getDate() - 7);
    setCurrentStartDate(prevWeekStartDate);
  };

  const handleNextWeek = () => {
    const nextWeekStartDate = new Date(currentStartDate);
    nextWeekStartDate.setDate(nextWeekStartDate.getDate() + 7);
    setCurrentStartDate(nextWeekStartDate);
  };

  const handleTimezoneChange = (e) => {
    const newTimezone = e.target.value;
    setSelectedTimezone(newTimezone);
  };

  const handleTimeChange = (dayIndex, hourIndex) => {
    const updatedTimeOptionsByDay = [...timeOptionsByDay];
    updatedTimeOptionsByDay[dayIndex][hourIndex].isChecked = !updatedTimeOptionsByDay[dayIndex][hourIndex].isChecked;
    setTimeOptionsByDay(updatedTimeOptionsByDay);

    const selectedDate = new Date(currentStartDate);
    selectedDate.setDate(selectedDate.getDate() + dayIndex);

    const selectedTimeSlot = updatedTimeOptionsByDay[dayIndex][hourIndex];
    const selectedTime = `${selectedTimeSlot.formattedHour}:00 ${selectedTimeSlot.period}`;

    setSelectedTimeSlots(prevSelectedTimeSlots => {
      const slotId = `${selectedDate.getTime()}-${selectedTimeSlot.hour}`;
      const slotExistsIndex = prevSelectedTimeSlots.findIndex(slot => slot.id === slotId);

      if (selectedTimeSlot.isChecked && slotExistsIndex === -1) {
        const newTimeSlot = {
          id: slotId,
          name: 'Your Name',
          date: selectedDate.toLocaleDateString('default', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
          }),
          time: selectedTime,
        };

        return [...prevSelectedTimeSlots, newTimeSlot];
      } else if (!selectedTimeSlot.isChecked && slotExistsIndex !== -1) {
        const updatedSelectedTimeSlots = [...prevSelectedTimeSlots];
        updatedSelectedTimeSlots.splice(slotExistsIndex, 1);
        console.log(updatedSelectedTimeSlots)
        return updatedSelectedTimeSlots;
      } else {
        return prevSelectedTimeSlots;
      }
    });

    console.log(selectedTimeSlots)
  };

  const updateAllTimes = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const startTime = 8; // 8:00 AM
    const endTime = 23; // 11:00 PM

    const timeOptionsByDay = days.map(() => {
      return Array.from({ length: endTime - startTime + 1 }, (_, index) => {
        const hour = startTime + index;
        const date = new Date();
        date.setHours(hour);

        const formattedTime = date.toLocaleString('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
          timeZone: selectedTimezone,
        });

        return {
          hour,
          formattedHour: formattedTime,
          isChecked: false,
        };
      });
    });

    setTimeOptionsByDay(timeOptionsByDay);
  };

  const renderDaysWithTime = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return (
      <div className="days-with-time">
        {days.map((day, dayIndex) => (
          <div key={day} className="day-with-time">
            <div className="day">{`${day} - ${new Date(currentStartDate.getFullYear(), currentStartDate.getMonth(), currentStartDate.getDate() + dayIndex).toLocaleDateString('default', { day: 'numeric', month: 'long', year: 'numeric' })}`}</div>
            <div className="time-options">
              {renderTimeOptions(dayIndex)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTimeOptions = (dayIndex) => {
    const timezoneOptions = { timeZone: selectedTimezone };

    return (
      <div className="time-options">
        {timeOptionsByDay[dayIndex]?.map(({ hour, formattedHour, period, isChecked }, index) => {
          const date = new Date(currentStartDate);
          date.setDate(date.getDate() + dayIndex); // Set the date according to the day index

          date.setHours(hour); // Set the hour for the date

          const formattedTime = date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            ...timezoneOptions,
          });

          return (
            <label key={hour}>
              <input
                type="checkbox"
                name={`time-${dayIndex}`}
                value={`${formattedTime}`}
                checked={isChecked}
                onChange={() => handleTimeChange(dayIndex, index)}
              />

              {`${formattedTime}`}
            </label>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div className="weekly-calendar">
        <div className="calendar-header">
          <button onClick={handlePrevWeek}>&lt; Previous Week</button>
          <div>{`Week of ${currentStartDate.toLocaleDateString('default', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}`}</div>
          <button onClick={handleNextWeek}>Next Week &gt;</button>
        </div>
      </div>
      <div className="weekly-calendar-with-timezone-and-working-hours">
        <div className="timezone-selector">
          <label htmlFor="timezoneSelect">Select Timezone:</label>
          <select id="timezoneSelect" value={selectedTimezone} onChange={handleTimezoneChange}>
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time (ET)</option>
          </select>
        </div>
        <div className="working-hours">
          {renderDaysWithTime()}  
        </div>

      </div>
      <div className="output"> {selectedTimeSlots.length > 0 && selectedTimeSlots?.map(res => {
        return <li  className="output-li"key={res?.id}>
          id: {res?.id} <br />
          name: {res?.name} <br />
          date: {res?.date} <br />
          time: {((res?.time?.split(" ")[0] || '').split(' ') || [])
            .filter(time => time)
            .map((time, index) => (
              <span key={index}>{time} </span>
            ))}
            {((res?.time?.split(" ")[1] || '').split(' ') || [])
            .filter(time => time)
            .map((time, index) => (
              <span key={index}>{time.slice(0,)} </span>
            ))}


        </li>
      })} </div>
    </div>
  );
};

export default Task;
