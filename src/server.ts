import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { SimpleNotion } from './index';

const app = new Hono();

app.get('/', (c) => {
  return c.json({
    message: 'Simple Notion API is running',
    version: '1.0.0',
    status: 'online'
  });
});

app.post('/page', async (c) => {
  const apiKey = c.req.header('Authorization')?.replace('Bearer ', '');
  if (!apiKey) return c.json({ error: 'Missing API Key' }, 401);

  const body = await c.req.json();
  const client = new SimpleNotion(apiKey);

  try {
    const result = await client.page.create({
      title: body.title,
      body: body.body,
      databaseId: body.databaseId
    });
    return c.json(result);
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port
});
