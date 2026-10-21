import 'dotenv/config';
import express, { Express, Request, Response, NextFunction, response } from 'express';
import cors from 'cors';

const app: Express = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://34.229.194.124:5173',
  ],
}));

app.get('/api/extract', async (req, res) => {
  const { url } = req.query;
  
  console.log("using API");
  const response = await fetch(
    `https://api.spoonacular.com/recipes/extract?url=${encodeURIComponent(url as string)}&includeNutrition=true&apiKey=${process.env.SPOONACULAR_KEY}`
  );
  const data = await response.json();
  res.json(data);
});


app.listen(3000, () => console.log('Server running on port 3000'));
