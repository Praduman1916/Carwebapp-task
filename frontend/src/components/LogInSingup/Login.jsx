import React, { useEffect, useState } from "react"
import "./login.scss"
import { useNavigate } from 'react-router-dom';
import jwtDecode from "jwt-decode";
import { request, gql } from 'graphql-request';
export default function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: ""
  })
  // const [loginUser, setLoginUser] = useState(null)
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
      mutation Login($input: loginInput!) {
        login(input: $input) {
          status
          error
          message
          user {
            id
            user_name
            email
          }
        }
      }
    `;
    const variables = { input: user };
    try {
      const data = await request('http://localhost:5000/login', mutation, variables);
      console.log('Test data', data);
      if (data.login.status === 'ok') {
        // setLoginUser(data.login.user)
        alert(data.login.message);
        let loginUser=data.login.user
        setTimeout(() => {
          navigate('/home/carlist',{state:{loginUser}});
        }, 600);
      } else {
        alert(data.login.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Login failed. Please try again.');
    }
  };
  return (
    <form className="login" onSubmit={handleSubmit}>
      <h1>Login</h1>
      <input
        required
        type="email"
        name="email"
        value={user.email}
        onChange={handleChange}
        placeholder="Enter your Email" />
      <input
        required
        type="password"
        name="password"
        value={user.password}
        onChange={handleChange}
        placeholder="Enter your Password" />
      <button type="submit" className="button">Login</button>
      <div>or</div>
      <div className="button" onClick={() => navigate("/")}>SignUp</div>
    </form>
  )
}
