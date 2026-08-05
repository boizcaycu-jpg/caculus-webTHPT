import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'online',
    system: 'CACULUS TSA Examination API Server',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'CACULUS Backend' });
});

app.listen(PORT, () => {
  console.log(`[CACULUS Server] Backend running on port ${PORT}`);
});
