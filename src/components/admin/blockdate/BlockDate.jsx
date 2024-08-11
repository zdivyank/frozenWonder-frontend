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
        setBlockedDates(data.map(block => ({
          ...block,
          date: formatDate(block.date),
        })));
      } else {
        setMessage('Failed to fetch blocked dates');
      }
    } catch (error) {
      setMessage('An error occurred while fetching blocked dates');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  };

  const handleBlock = async () => {
    if (!selectedDate || !timeslot) {
      setMessage('Please select both date and timeslot');
      return;
    }

    const formattedDate = formatDate(selectedDate);

    try {
      const response = await fetch(`${CONFIGS.API_BASE_URL}/block-date`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: formattedDate,
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
        setBlockedDates(prevBlockedDates =>
          prevBlockedDates.filter(block => !(block.date === date && block.timeslot === timeslot))
        );
      }
    } catch (error) {
      setMessage('An error occurred while unblocking the date');
    }
  };

  return (
    <div className='blockdate-card'>
      <h1 className='blockdate-title'>Block Dates</h1>
      
      <div className='blockdate-form'>
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
          className="blockdate-datepicker"
        />
        <select
          value={timeslot}
          onChange={(e) => setTimeslot(e.target.value)}
          className="blockdate-select"
        >
          <option value="">Select timeslot</option>
          <option value="morning">Morning</option>
          <option value="evening">Evening</option>
          <option value="fullday">Full Day</option>
        </select>
        <button onClick={handleBlock} className="blockdate-button">Block Date</button>
      </div>

      {message && <p className="blockdate-message">{message}</p>}

      <h2 className='blockdate-subtitle'>Blocked Dates</h2>
      <ul className='blockdate-list'>
        {blockedDates.length > 0 ? (
          blockedDates.map((block, index) => (
            <li key={index} className='blockdate-list-item'>
              {block.date} - {block.timeslot}
              <button onClick={() => handleUnblock(block.date, block.timeslot)} className='blockdate-unblock-button'>Unblock</button>
            </li>
          ))
        ) : (
          <p className="blockdate-empty">No dates are currently blocked.</p>
        )}
      </ul>
    </div>
  );
}

export default BlockDate;
