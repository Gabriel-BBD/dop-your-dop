import express, { Application, Request, Response } from 'express'
import * as dotenv from 'dotenv';
import userRouter from './src/controllers/user'
import { DBController } from './src/controllers/DBController'
import cors from 'cors'
import { generateData } from './src/dummy_data/batchDataGeneration';
import DatabaseService from './src/services/database.service';

dotenv.config();

const databaseController = new DBController();

const app: Application = express()

const port: number = 8080

app.use(cors());
app.use(express.json());

app.use('/user', userRouter);

app.post('/user/login', async (req, res) => {
    try {
      const { username, password } = req.body;

      const dbService = new DatabaseService();
    //   dbService.connect();
      const data = await dbService.login({username:username, password:password});
      if(!data?.error){
        res.status(201).send({username: username});
      }else{
        res.status(500).send(data?.error?.originalError?.info);
      }
  
    //   if(!data){
    //     res.status(500).json({ message: 'An error occurred during authentication' });
    //   }else if(data.response=201){
    //     res.json({ message: 'Login successful', data: {username: data.username} });
    //   }

    } catch (error) {
      // Handle any errors that occur during authentication
      console.error('Authentication error:', error);
      res.status(500).json({ message: 'An error occurred during authentication' });
    }
  });
  
app.post('/user/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    const registeredUser = { username:username, password:password, email:email };

    const dbService = new DatabaseService();

    const dataBaseResponse = await dbService.register(registeredUser);

    if(!dataBaseResponse?.error){
      res.status(201).send({username: username});
    }else{
      res.status(500).send(dataBaseResponse?.error?.originalError?.info);
    }

    // Replace the response with your actual registration logic
  } catch (error) {
    // Handle any errors that occur during registration
    console.error('Registration error:', error);
    res.status(500).json({ message: 'An error occurred during registration' });
  }
});

app.get('/drinks', async (req: Request, res: Response) => {
    const query = `SELECT * FROM ${process.env.DATABASE_NAME}.${process.env.TABLE_NAME}`;
    const response = await databaseController.executeQuery(query);
    res.send(response);
});

//TODO: add validation
app.post('/usersDrinks', async (req: Request, res: Response) => {
    const username = req?.body?.username;

    const query = `SELECT * FROM ${process.env.DATABASE_NAME}.${process.env.TABLE_NAME} WHERE username = '${username}'`;
    const response = await databaseController.executeQuery(query);
    res.send(response);
});

//TODO: add validation
app.get('/TimedDrinks', async (req: Request, res: Response) => {
    const time = req?.body?.time;//7d, 24h, 15m, etc

    const query = `SELECT * FROM ${process.env.DATABASE_NAME}.${process.env.TABLE_NAME} WHERE time between ago(${time}) and now()`;
    const response = await databaseController.executeQuery(query);
    res.send(response);
});

//TODO: add validation
app.get('/UsersTimedDrinks', async (req: Request, res: Response) => {
    const username = req?.body?.username;
    const time = req?.body?.time;//7d, 24h, 15m, etc

    const query = `SELECT * FROM ${process.env.DATABASE_NAME}.${process.env.TABLE_NAME} WHERE username = '${username}' AND time between ago(${time}) and now()`;
    const response = await databaseController.executeQuery(query);
    res.send(response);
});

app.post('/drink', async (req: Request, res: Response) => {

    const data = {
        username: req?.body?.username,
        drink: req?.body?.drink,
        quantity: parseFloat(req?.body?.quantity),
        time: req?.body?.time
    };

    if (!data?.username || !data.drink || !req?.body?.quantity || isNaN(data?.quantity)) {
        res.status(400).send('Invalid query parameters.');
        return;
    }

    const response = await databaseController.executeWrite(
        data.username,
        data.drink,
        data.quantity
    );

    res.send(response);
});


app.listen(port, function () {
    console.log(`App is listening on port ${port} !`)
})

export const handler = app