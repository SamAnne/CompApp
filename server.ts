import './instrument';
import 'dotenv/config';
import express, { Express, Request, Response, NextFunction, response } from 'express';
import cors from 'cors';
import * as Sentry from '@sentry/node';

const app: Express = express();
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://34.229.194.124:5173',
  ],
}));

app.get('/api/extract', async (req: Request, res: Response) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'url is required' });

    console.log('using API');
    const response = await fetch(
      `https://api.spoonacular.com/recipes/extract?url=${encodeURIComponent(url as string)}&includeNutrition=true&apiKey=${process.env.SPOONACULAR_KEY}`,
      { signal: AbortSignal.timeout(10000) }
    );

    if (response.status === 402) {
      Sentry.captureMessage('Spoonacular quota exceeded', 'error');
      return res.status(503).json({ error: 'Daily recipe limit reached, try again tomorrow' });
    }
    if (!response.ok) {
      Sentry.captureMessage(`Spoonacular returned ${response.status}`, 'error');
    }
    

    const data = await response.json();
    if (response.ok && !data.nutrition) {
      Sentry.captureMessage('Recipe missing nutrition data', 'warning');
    }
    res.status(response.status).json(data);
  } catch (err) {
    Sentry.captureException(err);
    console.error(err);
    res.status(500).json({ error: 'Failed to extract recipe' });
  }
});

// Optional health route, useful for uptime checks
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Must come after all routes
Sentry.setupExpressErrorHandler(app);

app.listen(3000, '0.0.0.0', () => console.log('Server running on port 3000'));