import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Health check API
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', workspace: 'MISA CukCuk' });
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log('Starting development mode with Vite middlewares...');

    // ShopeeFood integration Vite middleware
    const viteShopee = await createViteServer({
      root: path.resolve(process.cwd(), 'Cukcuk/[hangpt]-kết-nối-cukcuk---shopeefood-2.0'),
      server: { middlewareMode: true, hmr: false },
      base: '/shopeefood/',
      appType: 'spa'
    });

    // Onboarding POS integration Vite middleware
    const viteOnboarding = await createViteServer({
      root: path.resolve(process.cwd(), 'Cukcuk/[tbhung]_onboarding_pos---v3'),
      server: { middlewareMode: true, hmr: false },
      base: '/onboarding/',
      appType: 'spa'
    });

    // Grab Express integration Vite middleware
    const viteGrab = await createViteServer({
      root: path.resolve(process.cwd(), 'Cukcuk/grab-express-integration'),
      server: { middlewareMode: true, hmr: false },
      base: '/grab-express/',
      appType: 'spa'
    });

    // Mount Vite middlewares
    app.use('/shopeefood', viteShopee.middlewares);
    app.use('/onboarding', viteOnboarding.middlewares);
    app.use('/grab-express', viteGrab.middlewares);

    // Serve static portal assets directly
    app.use(express.static(path.resolve(process.cwd(), 'portal')));
    
    app.get('/', (req, res) => {
      res.redirect(302, '/grab-express/');
    });
  } else {
    console.log('Starting production mode...');

    // Serving pre-compiled static assets
    app.use('/shopeefood', express.static(path.resolve(process.cwd(), 'Cukcuk/[hangpt]-kết-nối-cukcuk---shopeefood-2.0/dist')));
    app.use('/onboarding', express.static(path.resolve(process.cwd(), 'Cukcuk/[tbhung]_onboarding_pos---v3/dist')));
    app.use('/grab-express', express.static(path.resolve(process.cwd(), 'Cukcuk/grab-express-integration/dist')));

    // SPA routing fallbacks for each sub-path
    app.get('/shopeefood/*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'Cukcuk/[hangpt]-kết-nối-cukcuk---shopeefood-2.0/dist/index.html'));
    });
    app.get('/onboarding/*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'Cukcuk/[tbhung]_onboarding_pos---v3/dist/index.html'));
    });
    app.get('/grab-express/*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'Cukcuk/grab-express-integration/dist/index.html'));
    });

    // Serve production static portal
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('/', (req, res) => {
      res.redirect(302, '/grab-express/');
    });
  }

  // Bind to host 0.0.0.0 and port 3000
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`==================================================`);
    console.log(`MISA CukCuk Workspace running on http://localhost:${PORT}`);
    console.log(`==================================================`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start CukCuk Workspace Dev Server:', err);
  process.exit(1);
});
