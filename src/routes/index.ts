// src/routes/index.ts
import express from 'express';

const router = express.Router();

const apiRoutes = [
  
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
