import './App.css';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Signup from './components/LogInSingup/Signup';
import Login from './components/LogInSingup/Login';
import CarList from './components/CarList';
import AddNewCar from './components/AddNewCar';
import LoggeduserCarList from './components/LoggeduserCarList';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/home/login" element={<Login />} />
          <Route exact path="/" element={<Signup />} />
          <Route exact path="/home/carlist" element={<CarList />} />
          <Route exaxt path="/home/addnewcar" element={<AddNewCar />} />
          <Route exact path="/home/loggedusercarlist" element={<LoggeduserCarList/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
