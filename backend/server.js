const express = require('express');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const User = require("./model/user.model")
const Mycar = require("./model/addcar.model")
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/car', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Database is connected');
})
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });

//singup user
const schema = buildSchema(`
  type Query {
    placeholder: String
  }
  input SignupInput {
    user_name: String!
    email: String!
    password: String!
  }
  type Mutation {
    signup(input: SignupInput!): SignupResponse
  }
  type SignupResponse {
    status: String!
    message: String
  }
  type User {
    id: ID
    user_name: String
    email: String
  }
`);
const signuproot = {
  signup: async ({ input }) => {
    const { user_name, email, password } = input;
    const takenUsername = await User.findOne({ email });
    if (takenUsername) {
      // throw new Error('Username already taken');
      return { status: "error", message: "User already exits ,please login" };
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const dbUser = new User({
        user_name,
        email,
        password: hashedPassword,
      });
      await dbUser.save();
      // return dbUser;
      return { status: "ok", message: "Successfully registered, please login" };
    }
  },
};

// log in user
const loginSchema = buildSchema(`
  type Query {
    placeholder: String
  }
  input loginInput {
    email: String!
    password: String!
  }
  type Mutation {
    login(input: loginInput!): LoginResponse
  }
  type LoginResponse {
    status: String!
    error: String
    message:String
    user:User
  }
  type User {
    id: ID
    user_name:String
    password: String
    email: String
  }
`);
const loginRoot = {
  login: async ({ input }) => {
    console.log('Test dd', { input });
    const { email, password } = input;
    const user = await User.findOne({ email });
    if (!user) {
      return { status: 'error', error: 'User does not exist' };
    }
    const isCorrect = await bcrypt.compare(password, user.password);
    if (isCorrect) {
      return { status: 'ok', message: 'Login successful', user: user };
    } else {
      return { status: 'error', error: 'Invalid password' };
    }
  },
};

// Add and update cars
const Carschema = buildSchema(`
  type Query {
    placeholder: String
  }
  type Car {
    car_name: String
    car_number: String
    made_date: String
    car_amount: String
    create_by: String
  }
  input AddCarInput {
    car_name: String!
    car_number: String!
    made_date: String!
    car_amount: String!
    create_by: String
  }
  type Mutation {
    addCar(input: AddCarInput!): Car
    updateCar(id: ID!, input: AddCarInput!): Car
  }
  type Mycar {
    id: ID
    car_name: String
    car_number: String
    made_date: String
    car_amount: String
    create_by: String 
  }
`);
const Carroot = {
  // hello: () => 'Hello, World!',
  addCar: async ({ input }) => {
    const { car_name, car_number, made_date, car_amount, create_by } = input;
    const dbCar = new Mycar({ car_name, car_number, made_date, car_amount, create_by });
    await dbCar.save();
    return dbCar;
  },
  updateCar: async ({ id, input }) => {
    const { car_name, car_number, made_date, car_amount, update_by } = input;
    const updatedCar = await Mycar.findByIdAndUpdate(
      id,
      { car_name, car_number, made_date, car_amount, update_by },
      { new: true }
    );
    return updatedCar;
  },
};

//Get all cars
const getCarschema = buildSchema(`
type Car {
  _id: ID
  car_name: String
  car_number: String
  made_date: String
  car_amount: String
  
}
type Query {
  getCars: [Car]
}
`);
const getCarroot = {
  getCars: async () => {
    try {
      const cars = await Mycar.find().sort({ _id: -1 });
      return cars;
    } catch (error) {
      console.error('Error fetching cars:', error);
      return [];
    }
  },
};
// get loggedin use car
const logged_user_scema = buildSchema(`
  type Query {
    getCars(email: String!): [Car]
  }

  type Car {
    _id: ID
    car_name: String
    car_number: String
    made_date: String
    car_amount: String
    email: String
  }
`);
const logged_user_root = {
  getCars: async ({ email }) => {
    console.log("Test emailllll", email)
    try {
      const cars = await Mycar.find({ create_by: email });
      console.log(cars)
      return cars;
    } catch (error) {
      throw new Error('Failed to fetch cars');
    }
  },
};
//get search  car number
const filterCarSchema = buildSchema(`
  type Query {
    getCarsByCarNumber(carNumber: String!): [Car]
  }

  type Car {
    _id: ID
    car_name: String
    car_number: String
    made_date: String
    car_amount: String
  }
`);
const filterCarroot = {
  getCarsByCarNumber: async ({ carNumber }) => {
    console.log("seach car", carNumber)
    const filteredCars = await Mycar.find({ car_number: carNumber });
    console.log("test fitred car", filteredCars)
    return filteredCars;
  },
};
app.use('/getseachcar', graphqlHTTP({ schema: filterCarSchema, rootValue: filterCarroot, graphiql: true }));
app.use('/loggedusercarlist', graphqlHTTP({ schema: logged_user_scema, rootValue: logged_user_root, graphiql: true }));
app.use('/addnewcar', graphqlHTTP({ schema: Carschema, rootValue: Carroot, graphiql: true }));
app.use('/getallcars', graphqlHTTP({ schema: getCarschema, rootValue: getCarroot, graphiql: true }));
app.use('/login', graphqlHTTP({ schema: loginSchema, rootValue: loginRoot, graphiql: true }));
app.use('/signup', graphqlHTTP({ schema, rootValue: signuproot, graphiql: true }));
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
