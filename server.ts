import 'dotenv/config';
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';


const app: Express = express();
app.use(cors());

app.get('/api/extract', async (req, res) => {
  const { url } = req.query;
  
  const response = await fetch(
    `https://api.spoonacular.com/recipes/extract?url=${encodeURIComponent(url as string)}&includeNutrition=true&apiKey=${process.env.SPOONACULAR_KEY}`
  );
  const data = await response.json();
  res.json(data);
});

app.listen(3001, () => console.log('Server running on port 3001'));