import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { gql, request } from 'graphql-request';
import './LoggeduserCarList.scss'; 
const LoggeduserCarList = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const loginUser = location.state?.loginUser;
    const [cars, setCars] = useState([]);
  
    useEffect(() => {
      const fetchLoggeduserCars = async () => {
        const GET_CARS = gql`
          query GetCars($email: String!) {
            getCars(email: $email) {
              _id
              car_name
              car_number
              made_date
              car_amount
              email
            }
          }
        `;
        try {
          const data = await request('http://localhost:5000/loggedusercarlist', GET_CARS,{email: loginUser?.email,});
          console.log('Cars data:', data);
          setCars(data.getCars);
        } catch (error) {
          console.error('Error fetching cars:', error);
        }
      };
  
      fetchLoggeduserCars();
    }, [loginUser]);
  
    return (
      <div className="logged-user-car-list">
        <h2 style={{textAlign:"center",marginBottom:"3rem"}}>Logged in user car list</h2>
        <table>
          <thead>
            <tr>
              <th>Car Name</th>
              <th>Car Number</th>
              <th>Made Date</th>
              <th>Car Amount</th>
              {/* <th>Photo</th> */}
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            {cars.length > 0 ? (
              cars.map((car) => (
                <tr key={car._id}>
                  <td>{car.car_name}</td>
                  <td>{car.car_number}</td>
                  <td>{car.made_date}</td>
                  <td>{car.car_amount}</td>
                  {/* <td>
                    <img src={car.photo} alt="Car" />
                  </td> */}
                  <td>
                    <button
                      onClick={() => navigate('/home/addnewcar', { state: { car } })}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  style={{
                    textAlign: 'center',
                    color: 'red',
                    fontSize: '1.5rem',
                  }}
                  colSpan="6"
                >
                  Car not found, please add.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default LoggeduserCarList;
  