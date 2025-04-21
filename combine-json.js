import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to combine JSON files
function combineJsonFiles() {
  try {
    // Create an array to store all items
    let allItems = [];
    
    // Read and combine all page files
    for (let i = 0; i <= 6; i++) {
      const filePath = path.join(__dirname, `page-${i}.json`);
      console.log(`Reading file: page-${i}.json`);
      
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileContent);
      
      // Add items to the combined array
      if (jsonData.items && Array.isArray(jsonData.items)) {
        allItems = allItems.concat(jsonData.items);
        console.log(`Added ${jsonData.items.length} items from page-${i}.json`);
      }
    }
    
    // Create the combined JSON structure
    const combinedData = {
      kind: "youtube#searchListResponse",
      etag: "combined-fallback-data",
      regionCode: "PK",
      pageInfo: {
        totalResults: allItems.length,
        resultsPerPage: allItems.length
      },
      items: allItems
    };
    
    // Write the combined data to fallback-videos.json
    const outputPath = path.join(__dirname, 'public', 'data', 'fallback-videos.json');
    
    // Ensure the directory exists
    const dirPath = path.dirname(outputPath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(combinedData, null, 2), 'utf8');
    console.log(`Successfully created fallback-videos.json with ${allItems.length} items`);
    
  } catch (error) {
    console.error('Error combining JSON files:', error);
  }
}

// Run the function
combineJsonFiles(); 