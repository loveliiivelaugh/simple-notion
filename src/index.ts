
export interface NotionBlock {
  object: 'block';
  type: string;
  [key: string]: any;
}

export class SimpleNotion {
  private apiKey: string;
  private baseUrl = 'https://api.notion.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Converts markdown string to Notion blocks
   */
  private markdownToBlocks(markdown: string): NotionBlock[] {
    const lines = markdown.split('\n');
    const blocks: NotionBlock[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith('# ')) {
        blocks.push({
          object: 'block',
          type: 'heading_1',
          heading_1: {
            rich_text: [{ type: 'text', text: { content: trimmed.substring(2) } }]
          }
        });
      } else if (trimmed.startsWith('## ')) {
        blocks.push({
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [{ type: 'text', text: { content: trimmed.substring(3) } }]
          }
        });
      } else if (trimmed.startsWith('### ')) {
        blocks.push({
          object: 'block',
          type: 'heading_3',
          heading_3: {
            rich_text: [{ type: 'text', text: { content: trimmed.substring(4) } }]
          }
        });
      } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        blocks.push({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ type: 'text', text: { content: trimmed.substring(2) } }]
          }
        });
      } else {
        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ type: 'text', text: { content: trimmed } }]
          }
        });
      }
    }

    return blocks;
  }

  public get page() {
    return {
      create: async (params: { title: string; body: string; databaseId: string }) => {
        const blocks = this.markdownToBlocks(params.body);
        
        const response = await fetch(`${this.baseUrl}/pages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            parent: { database_id: params.databaseId },
            properties: {
              title: [
                {
                  text: {
                    content: params.title
                  }
                }
              ]
            },
            children: blocks
          })
        });

        if (!response.ok) {
          throw new Error(`Notion API Error: ${response.statusText}`);
        }

        return await response.json();
      }
    };
  }
}
