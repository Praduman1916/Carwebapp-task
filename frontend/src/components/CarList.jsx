import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { request, gql } from 'graphql-request';
import './CarList.scss';

export default function CarList() {
  let location = useLocation();
  const navigate = useNavigate();
  const loginUser = location.state?.loginUser;
  console.log("Test user",loginUser)
  const [cars, setCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCarNumber, setSearchCarNumber] = useState('');
  const carsPerPage = 5;
  const GET_CARS = gql`
    query GetCars {
      getCars {
        _id
        car_name
        car_number
        made_date
        car_amount
      }
    }
  `;
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await request('http://localhost:5000/getallcars', GET_CARS);
        console.log('Cars data:', data);
        setCars(data.getCars);
      } catch (error) {
        console.error('Error fetching cars:', error);
      }
    };

    fetchCars();
  }, []);

  const search_car = gql`
  query GetCars($carNumber: String!) {
    getCarsByCarNumber(carNumber: $carNumber) {
      _id
      car_name
      car_number
      made_date
      car_amount
    }
  }
`;
  const handleSearchCar = async () => {
    try {
      const variables = {
        carNumber: searchCarNumber,
      };
      console.log("test cvvv",variables)
      const data = await request('http://localhost:5000/getseachcar', search_car, variables);
      console.log('Cars data:', data);
      setCars(data.getCarsByCarNumber)
    } catch (error) {
      console.error('Error searching cars:', error);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = cars.slice(indexOfFirstCar, indexOfLastCar);
  console.log("Test all cars", cars);
  return (
    <div className="CarList">
      <div className="header">
        <h3 className="title">Hi<br />{loginUser && loginUser.user_name}</h3>
      </div>
      <div>
        <h1>Car List</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by Car Number"
            value={searchCarNumber}
            onChange={(e) => setSearchCarNumber(e.target.value)}
          />
          <button onClick={handleSearchCar}>Search</button>
        </div>

        <div className="button">
        <button onClick={() => navigate('/home/addnewcar',{state:{loginUser}})}>Add New Car</button>
        <button onClick={() => navigate('/home/loggedusercarlist',{state:{loginUser}})}>See my Cars</button>
      </div>
      <br/>
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
            {currentCars.length>0?currentCars.map((car) => (
              <tr key={car._id}>
                <td>{car.car_name}</td>
                <td>{car.car_number}</td>
                <td>{car.made_date}</td>
                <td>{car.car_amount}</td>
                {/* <td>
                  <img src={car.photo} alt="Car" />
                </td> */}
                <td><button onClick={()=>navigate('/home/addnewcar',{state:{car}})}>Edit</button></td>
              </tr>
            )):
            <tr>
              <td style={{textAlign:'center',color:'red',fontSize:'1.5rem'}} colSpan='6'>Car not found,Please Add</td>
              </tr>}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous </button>
          <button onClick={handleNextPage} disabled={indexOfLastCar >= cars.length}>Next</button>
        </div>
      </div>
    </div>
  );
}
