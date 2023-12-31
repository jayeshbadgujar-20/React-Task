import React, { useEffect, useState } from 'react';

const Calender = () => {
  const [currentStartDate, setCurrentStartDate] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState('UTC');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('8:00 AM');

  useEffect(() => {
    loadData(currentStartDate);

    const intervalId = setInterval(() => {
      const updatedTime = new Date();
      setCurrentTime(updatedTime);
      updateAllTimes();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentStartDate, selectedTimezone]);

  const loadData = (startDate) => {
    console.log('Loading data for the week starting from:', startDate);
  };

  const handlePrevWeek = () => {
    const prevWeekStartDate = new Date(currentStartDate);
    prevWeekStartDate.setDate(prevWeekStartDate.getDate() - 7);
    setCurrentStartDate(prevWeekStartDate);
    updateAllTimes();
  };

  const handleNextWeek = () => {
    const nextWeekStartDate = new Date(currentStartDate);
    nextWeekStartDate.setDate(nextWeekStartDate.getDate() + 7);
    setCurrentStartDate(nextWeekStartDate);
    updateAllTimes();
  };

  const handleTimezoneChange = (e) => {
    const newTimezone = e.target.value;
    setSelectedTimezone(newTimezone);
    updateAllTimes();
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const updateAllTimes = () => {
    const startTime = 8; // 8:00 AM
    const endTime = 23; // 11:00 PM

    const timeOptions = [];

    for (let i = startTime; i <= endTime; i++) {
      const formattedTime = formatTime(i, selectedTimezone);
      timeOptions.push(formattedTime);
    }

    setSelectedTime(timeOptions[0]);
  };

  const formatTime = (hour, timezone) => {
    const date = new Date();
    date.setHours(hour, 0, 0, 0);

    const options = {
      hour: 'numeric',
      minute: 'numeric',
      timeZone: timezone,
    };

    try {
      const formattedTime = new Intl.DateTimeFormat('en-US', options).format(date);
      console.log(`Hour: ${hour}, UTC Time: ${date.toISOString()}, Local Time: ${formattedTime}`);
      return formattedTime;
    } catch (error) {
      console.error(`Error formatting time for hour ${hour}:`, error);
      return 'Invalid Date';
    }
  };

  const renderDaysWithTime = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return (
      <div className="days-with-time">
        {days.map((day, index) => (
          <div key={day} className="day-with-time">
            <div className="day">{`${day} - ${new Date(currentStartDate.getFullYear(), currentStartDate.getMonth(), currentStartDate.getDate() + index).toLocaleDateString('default', { day: 'numeric', month: 'long', year: 'numeric' })}`}</div>
            <div className="time-options">
              {renderTimeOptions()}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTimeOptions = () => {
    const startTime = 8; // 8:00 AM
    const endTime = 23; // 11:00 PM

    return (
      <div className="time-options">
        {[...Array(endTime - startTime + 1)].map((_, index) => {
          const hour = startTime + index;
          const formattedHour = (hour % 12 === 0 ? 12 : hour % 12).toString().padStart(2, '0');
          const period = hour < 12 ? 'AM' : 'PM';
          const formattedTime = `${formattedHour}:00 ${period}`;
          return (
            <label key={hour}>
              <input
                type="radio"
                name="time"
                value={formattedTime}
                checked={selectedTime === formattedTime}
                onChange={() => handleTimeChange(formattedTime)}
              />
              {formattedTime}
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
            {/* Add more timezones as needed */}
          </select>
        </div>
        <div className="working-hours">
          {renderDaysWithTime()}
        </div>
      </div>
    </div>
  );
};

export default Calender;
