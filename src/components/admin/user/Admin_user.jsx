import React, { useState } from 'react';
import { BsEyeSlashFill } from 'react-icons/bs';
import { IoEyeSharp } from 'react-icons/io5';
import { Input, InputGroup } from 'rsuite';

function Admin_user() {
  const styles = {
    width: 300
  };

  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    email: "",
    password: "",
  });

  // Update handleChange to work with rsuite's Input onChange
  const handleChange = (value, name) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleEyeChange = () => {
    setVisible(!visible);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add submit logic here
  };

  return (
    <div>
      <h1 className='m-3'>Our Users</h1>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="form_div">
          <label htmlFor="username">Username:</label>
          <Input
            type="text"
            name="username"
            id="username"
            placeholder="Enter Your Username"
            onChange={(value) => handleChange(value, 'username')}
            value={formData.username}
            required
          />
        </div>
        <div className="form_div">
          <label htmlFor="phone">Phone:</label>
          <Input
            type="number"
            name="phone"
            id="phone"
            placeholder="Enter User's Mobile No."
            onChange={(value) => handleChange(value, 'phone')}
            value={formData.phone}
            required
          />
        </div>
        <div className="form_div">
          <label htmlFor="email">Role:</label>
         
        </div>
        <div className="form_div">
          <label htmlFor="email">Email:</label>
          <Input
            type="email"
            name="email"
            id="email"
            placeholder="Enter Your Email"
            onChange={(value) => handleChange(value, 'email')}
            value={formData.email}
            required
          />
        </div>
        <div className="form_div">
          <label htmlFor="password">Password:</label>
          <InputGroup inside style={styles}>
            <Input
              type={visible ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder="Enter Your Password"
              onChange={(value) => handleChange(value, 'password')}
              value={formData.password}
              required
            />
            <InputGroup.Button onClick={handleEyeChange}>
              {visible ? <IoEyeSharp /> : <BsEyeSlashFill />}
            </InputGroup.Button>
          </InputGroup>
        </div>
        <div className="form_div text-center">
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}

export default Admin_user;
