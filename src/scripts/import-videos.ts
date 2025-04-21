import { db } from '@/lib/db';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface YouTubeVideo {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      default: { url: string };
    };
    channelTitle: string;
    channelId: string;
  };
}

interface YouTubeResponse {
  items: YouTubeVideo[];
}

async function importVideos() {
  try {
    const rootDir = path.join(__dirname, '../../..');
    const files = fs.readdirSync(rootDir)
      .filter(file => file.startsWith('page-') && file.endsWith('.json'));

    let totalVideos = 0;
    let importedVideos = 0;
    let skippedVideos = 0;

    for (const file of files) {
      const filePath = path.join(rootDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const data: YouTubeResponse = JSON.parse(fileContent);

      for (const item of data.items) {
        totalVideos++;

        // Check if video already exists
        const existingVideo = await db.video.findUnique({
          where: { videoId: item.id }
        });

        if (existingVideo) {
          console.log(`Skipping existing video: ${item.snippet.title}`);
          skippedVideos++;
          continue;
        }

        // Import new video
        await db.video.create({
          data: {
            videoId: item.id,
            title: item.snippet.title,
            description: item.snippet.description,
            publishedAt: new Date(item.snippet.publishedAt),
            thumbnailUrl: item.snippet.thumbnails.default.url,
            channelTitle: item.snippet.channelTitle,
            channelId: item.snippet.channelId,
            isActive: true
          }
        });

        console.log(`Imported video: ${item.snippet.title}`);
        importedVideos++;
      }
    }

    console.log('\nImport Summary:');
    console.log(`Total videos found: ${totalVideos}`);
    console.log(`Videos imported: ${importedVideos}`);
    console.log(`Videos skipped: ${skippedVideos}`);

  } catch (error) {
    console.error('Error importing videos:', error);
  } finally {
    await db.$disconnect();
  }
}

// Run the import
importVideos(); 