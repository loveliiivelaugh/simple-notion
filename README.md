# Simple Notion

A lightweight, developer-friendly wrapper for the Notion API.

## Goal
To make interacting with Notion as simple as writing Markdown.

## Features (Planned)
- **Markdown Support:** Pass standard markdown strings, get formatted Notion blocks.
- **Smart Chunking:** Automatically splits large content to respect Notion API limits.
- **Type-Safe:** Built with TypeScript for full autocomplete support.

## Usage

```typescript
import { SimpleNotion } from 'simple-notion';

const client = new SimpleNotion(process.env.NOTION_KEY);

await client.page.create({
  databaseId: '...',
  title: 'My New Page',
  body: '# Hello World\n\nThis is a paragraph generated from markdown.'
});
```
