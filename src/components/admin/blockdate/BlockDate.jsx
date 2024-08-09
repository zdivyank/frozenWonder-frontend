import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './blockdate.css';
import { CONFIGS } from '../../../../config';

function BlockDate() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeslot, setTimeslot] = useState('');
  const [blockedDates, setBlockedDates] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBlockedDates();
  }, []);

  const fetchBlockedDates = async () => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/blocked-dates`);
      if (response.ok) {
        const data = await response.json();
        setBlockedDates(data);
      } else {
        setMessage('Failed to fetch blocked dates');
      }
    } catch (error) {
      setMessage('An error occurred while fetching blocked dates');
    }
  };

  const handleBlock = async () => {
    if (!selectedDate || !timeslot) {
      setMessage('Please select both date and timeslot');
      return;
    }

    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/block-date`  , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          timeslot: timeslot,
        }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        fetchBlockedDates();
      }
    } catch (error) {
      setMessage('An error occurred while blocking the date');
    }
  };

  const handleUnblock = async (date, timeslot) => {
    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/unblock-date`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: date,
          timeslot: timeslot,
        }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (response.ok) {
        fetchBlockedDates();
      }
    } catch (error) {
      setMessage('An error occurred while unblocking the date');
    }
  };

  return (
    <div className='block_container'>
      <h1>Block Dates</h1>
      
      <div className='block_form'>
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
        />
        <select
          value={timeslot}
          onChange={(e) => setTimeslot(e.target.value)}
        >
          <option value="">Select timeslot</option>
          <option value="morning">Morning</option>
          <option value="evening">Evening</option>
          <option value="fullday">Full Day</option>
        </select>
        <button onClick={handleBlock}>Block Date</button>
      </div>

      {message && <p className="message">{message}</p>}

      <h2>Blocked Dates</h2>
      <ul className='blocked_dates_list'>
        {blockedDates.map((block, index) => (
          <li key={index}>
            {block.date} - {block.timeslot}
            <button onClick={() => handleUnblock(block.date, block.timeslot)}>Unblock</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BlockDate;