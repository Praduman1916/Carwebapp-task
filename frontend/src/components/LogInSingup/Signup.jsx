import React, { useState } from 'react'
import "./Signup.scss"
import { useNavigate } from 'react-router-dom';
import { request, gql } from 'graphql-request';
export default function Signup() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    user_name: "",
    email: "",
    password: "",
  })
  const handleChange = e => {
    const { name, value } = e.target
    setUser({
      ...user,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mutation = gql`
      mutation Signup($input: SignupInput!) {
        signup(input: $input) {
          status
          message
        }
      }
    `;
    const variables = { input: user };
    try {
      const data = await request('http://localhost:5000/signup', mutation, variables);
      console.log('Test data', data);
      if (data.signup) {
        if (data.signup.status === 'ok') {
          alert(data.signup.message);
          setTimeout(() => {
            navigate("/home/login");
          }, 600);
        } else {
          alert(data.signup.message);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form className="Signup" onSubmit={handleSubmit}>
      <h2>Signup</h2>
      <input
        required
        type="text"
        name="user_name"
        value={user.user_name}
        placeholder="Enter Name"
        onChange={handleChange}
      />
      <input
        required
        type="email"
        name="email"
        value={user.email}
        placeholder="Enter Email"
        onChange={handleChange}
      />
      <input
        required
        type="password"
        name="password"
        value={user.password}
        placeholder="Your Password"
        onChange={handleChange}
      />

      <button type="submit" className="button">Signup</button>
      <div>or</div>
      <button className="button" onClick={() => navigate("/home/login")}>Login</button>
    </form>
  )
}
