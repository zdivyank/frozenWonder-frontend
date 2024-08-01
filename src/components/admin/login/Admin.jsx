import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { CONFIGS } from '../../../../config';
import { useAuth } from '../../../store/Auth';
import { useNavigate } from 'react-router-dom';
import { Input } from 'rsuite';
import './admin.css'; // Import the CSS file for the admin page

function Admin() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const URL = `${CONFIGS.API_BASE_URL}/login`;

  const { userAuthentication, storeTokenInLS } = useAuth();
  const navigate = useNavigate();

  const handleInput = (value, name) => {
    setUser(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user);

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      const res_data = await response.json();
      console.log("res from server", res_data);

      if (response.ok) {
        storeTokenInLS(res_data.token);
        setUser({
          email: "",
          password: "",
        });

        toast.success('Login successful!', {
         
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        navigate('/admin/product');

      } else {
        toast.error(res_data.extraDetails || res_data.message, {
          style: {
            background: '#212121',
            color: 'white',
          },
          position: 'top-center',
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        console.log('Login failed');
      }

    } catch (error) {
      console.log("Error from catch", error);
    }

  }
  return (
    <section className="admin-section">
      <h2>Login</h2>
      <form action="" onSubmit={handleSubmit}>
        <div className="form_div">
          <label htmlFor="email">
            Email:
          </label>
          <Input 
            type="email" 
            name="email" 
            id="email" 
            placeholder="Enter Your Email" 
            onChange={(value) => handleInput(value, 'email')} 
            value={user.email} 
            required 
          />
        </div>

        <div className="form_div">
          <label htmlFor="password">
            Password:
          </label>
          <Input 
            type="password" 
            name="password" 
            id="password" 
            placeholder="Enter Your Password" 
            onChange={(value) => handleInput(value, 'password')} 
            value={user.password} 
            required 
          />
        </div>

        <div className="form_div text-center">
          <button type="submit">Login</button>
        </div>
      </form>
    </section>
  )
}

export default Admin;
