// // server.js
// import dotenv from "dotenv";
// dotenv.config();

// import express from 'express';
// import cors from 'cors';
// import fs from 'fs';

// import { analyzeBase64Image } from "./captioning.js";


// // import path from "path";
// // const imagePath = path.resolve("./label.jpg");

// // (async () => {
// // try {
// // const imageBuffer = fs.readFileSync(imagePath);
// // const base64Image = imageBuffer.toString("base64");
// // const result = await analyzeBase64Image(base64Image);
// // console.log("Result:", result);
// // } catch (error) {
// // console.error("Error:", error.message);
// // }
// // })();

// const app = express();
// const PORT = 3000;

// app.use(express.json());
// app.use(cors());

// app.get('/getMarkers', async(req, res) => {
//   fs.readFile('markers.json', 'utf8', (err, data) => {
//     if (err) {
//       console.error('Error reading markers.json:', err);
//       return res.status(500).json({ error: 'Failed to load markers' });
//     }

//     try {
//       const markers = JSON.parse(data);
//       res.json(markers);
//     } catch (parseError) {
//       console.error('Error parsing markers.json:', parseError);
//       res.status(500).json({ error: 'Invalid JSON format' });
//     }
//   });
// });

// app.post('/uploadMarker', async(req, res) => {
//   const { image, lat, lon } = req.body;
//   console.log('Received data:', { image, lat, lon });
//   let intermediate = await analyzeBase64Image(image);
//   intermediate["lat"] = lat;
//   intermediate["lon"] = lon;
//   res.sendStatus(200);
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import fs from 'fs';

import { analyzeBase64Image } from "./captioning.js";

const app = express();
const PORT = 4000;

app.use(express.json({ limit: '10mb' })); // Allow larger base64 images
app.use(cors());

app.get('/getMarkers', (req, res) => {
  fs.readFile('markers.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading markers.json:', err);
      return res.status(500).json({ error: 'Failed to load markers' });
    }

    try {
      const markers = JSON.parse(data);
      res.json(markers);
    } catch (parseError) {
      console.error('Error parsing markers.json:', parseError);
      res.status(500).json({ error: 'Invalid JSON format' });
    }
  });
});

app.post('/uploadMarker', async (req, res) => {
  console.log("/upload marker hit")
  const { image, lat, lon } = req.body;

  try {
    const intermediate = await analyzeBase64Image(image);
    intermediate["lat"] = lat;
    intermediate["lon"] = lon;

    // console.log(intermediate)

    // Load current markers
    let markers = null;
    try {
      const data = fs.readFileSync('markers.json', 'utf8');
      markers = JSON.parse(data);
    } catch (err) {
      console.warn("markers.json not found or invalid. Creating new.");
    }

    // console.log(markers)

    // Add new marker
    markers.markers.push(intermediate);

    // Save updated markers list
    fs.writeFileSync('markers.json', JSON.stringify(markers, null, 2), 'utf8');

    res.status(200).json({ message: 'Marker uploaded successfully' });
  } catch (error) {
    console.error("Error analyzing image or saving marker:", error);
    res.status(500).json({ error: 'Failed to process marker' });
  }
});

app.listen(PORT,"0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});