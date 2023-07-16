import React, { useEffect, useState } from 'react'
import './CarForm.scss';
import { useNavigate } from 'react-router-dom';
import { request, gql } from 'graphql-request';
import { useLocation } from 'react-router-dom';
export default function AddNewCar() {
  const navigate = useNavigate();
  let location = useLocation();
  const data = location.state?.car;
  const loginUser=location.state?.loginUser
  console.log("Test log in user",loginUser)
  console.log("Test data for edit", data)
  const [cars, setCars] = useState({
    car_name: '',
    car_number: '',
    made_date: '',
    car_amount: 0,
    create_by:loginUser&&loginUser.email,
  });
  useEffect(() => {
    if (data) {
      setCars({
        car_name: data.car_name,
        car_number: data.car_number,
        made_date: data.made_date,
        car_amount: data.car_amount,
        // photo:data.photo,
      });
    }
  }, [data]);
  const handleChange = e => {
    const { name, value } = e.target;
    setCars(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = 'http://localhost:5000/addnewcar';
    const mutation = gql`
      mutation AddCar($input: AddCarInput!) {
        addCar(input: $input) {
          car_name
          car_number
          made_date
          car_amount
          create_by
        }
      }
    `;
    const updateMutation = gql`
    mutation UpdateCar($id: ID!, $input: AddCarInput!) {
      updateCar(id: $id, input: $input) {
        car_name
        car_number
        made_date
        car_amount
      }
    }
  `;

    const variables = { input: cars };
    try {
      if (data && data._id) {
        const updateData = await request(endpoint, updateMutation, {
          id: data._id,
          input: cars,
        });
        console.log('Update data', updateData);

        if (updateData.updateCar) {
          alert('Car Updated');
          setTimeout(() => {
            navigate('/home/carlist');
          }, 600);
        }
      } else {
        const addData = await request(endpoint, mutation, variables);
        console.log('Add data', addData);

        if (addData.addCar) {
          alert('New Car Added');
          setTimeout(() => {
            navigate('/home/carlist');
          }, 600);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }

  };

  const handleReset = () => {
    setCars({
      car_name: '',
      car_number: '',
      made_date: '',
      car_amount: '',
    });
  };

  return (
    <form className="CarForm" onSubmit={handleSubmit}>
      <div>
        <label>Car Name:</label>
        <input
          type="text"
          name="car_name"
          value={cars.car_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Car Number:</label>
        <input
          type="text"
          name="car_number"
          value={cars.car_number}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Made Date:</label>
        <input
          type="date"
          name="made_date"
          value={cars.made_date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Car Amount:</label>
        <input
          type="number"
          name="car_amount"
          value={cars.car_amount}
          onChange={handleChange}
          required
        />
      </div>
      {/* <div>
        <label>Photo:</label>
        <input
          type="file"
          name="photo"
          value={cars.photo}
          onChange={handleChange}
        />
      </div> */}
      <div>
        <button type="submit">{data && data._id?"Update":"Submit"}</button>
        <button type="button" onClick={handleReset}>Reset</button>
      </div>
    </form>
  );
}
