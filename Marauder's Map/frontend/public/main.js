
// // // // // // // (async () => {
// // // // // // //   const response = await fetch('http://localhost:3000/getMarkers');
// // // // // // //   const data = await response.json();
// // // // // // //   const markers = data.markers;
// // // // // // //   console.log(markers)

// // // // // // //   // Initialize HERE map
// // // // // // //   var platform = new H.service.Platform({
// // // // // // //     apikey: "fni7yJt1UNpagDbFd68KWE_0mOGAqlvsBWlQG6Kfyxg"
// // // // // // //   });

// // // // // // //   var defaultLayers = platform.createDefaultLayers();

// // // // // // //   var map = new H.Map(
// // // // // // //     document.getElementById('map'),
// // // // // // //     defaultLayers.vector.normal.map,
// // // // // // //     {
// // // // // // //       zoom: 17,
// // // // // // //       center: { lat: 19.123800599557097, lng: 72.83503128858327 },
// // // // // // //       pixelRatio: window.devicePixelRatio || 1
// // // // // // //     }
// // // // // // //   );

// // // // // // //   window.addEventListener('resize', () => map.getViewPort().resize());

// // // // // // //   var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// // // // // // //   var ui = H.ui.UI.createDefault(map, defaultLayers);

// // // // // // //   addInfoBubble(map, ui, markers); // Add the bubbles

// // // // // // //   function addMarkerToGroup(group, coordinate, html) {
// // // // // // //     var marker = new H.map.Marker(coordinate);
// // // // // // //     marker.setData(html);
// // // // // // //     group.addObject(marker);
// // // // // // //   }

// // // // // // //   function addInfoBubble(map, ui, markers) {
// // // // // // //     var group = new H.map.Group();
// // // // // // //     map.addObject(group);

// // // // // // //     group.addEventListener("tap", function (evt) {
// // // // // // //       var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
// // // // // // //         content: evt.target.getData()
// // // // // // //       });
// // // // // // //       ui.addBubble(bubble);
// // // // // // //     }, false);

// // // // // // //     // Add each marker from fetched data
// // // // // // //     markers.forEach(marker => {
// // // // // // //       const html = `<div><strong>${marker.title}</strong></div><div>${marker.description}</div>`;
// // // // // // //       addMarkerToGroup(group, { lat: marker.lat, lng: marker.lon }, html);
// // // // // // //     });
// // // // // // //   }
// // // // // // // })();

// // // // // // (async () => {
// // // // // //   const response = await fetch('http://localhost:3000/getMarkers');
// // // // // //   const data = await response.json();
// // // // // //   const markers = data.markers;
// // // // // //   console.log(markers)

// // // // // //   // Initialize HERE map
// // // // // //   var platform = new H.service.Platform({
// // // // // //     apikey: "fni7yJt1UNpagDbFd68KWE_0mOGAqlvsBWlQG6Kfyxg"
// // // // // //   });

// // // // // //   var defaultLayers = platform.createDefaultLayers();

// // // // // //   var map = new H.Map(
// // // // // //     document.getElementById('map'),
// // // // // //     defaultLayers.vector.normal.map,
// // // // // //     {
// // // // // //       zoom: 17,
// // // // // //       center: { lat: 19.123800599557097, lng: 72.83503128858327 },
// // // // // //       pixelRatio: window.devicePixelRatio || 1
// // // // // //     }
// // // // // //   );

// // // // // //   window.addEventListener('resize', () => map.getViewPort().resize());

// // // // // //   var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// // // // // //   var ui = H.ui.UI.createDefault(map, defaultLayers);

// // // // // //   addInfoBubble(map, ui, markers); // Add the bubbles

// // // // // //   function createColoredMarkerIcon(color) {
// // // // // //     // Create SVG icon with the specified color
// // // // // //     const svg = `<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
// // // // // //       <circle cx="12" cy="12" r="10" fill="${color}" stroke="#fff" stroke-width="2"/>
// // // // // //     </svg>`;
    
// // // // // //     // Create icon from SVG
// // // // // //     return new H.map.Icon(
// // // // // //       `data:image/svg+xml;base64,${btoa(svg)}`,
// // // // // //       { size: { w: 24, h: 24 } }
// // // // // //     );
// // // // // //   }

// // // // // //   function addMarkerToGroup(group, coordinate, html, color) {
// // // // // //     // Use default color if none provided
// // // // // //     const markerColor = color || '#3366cc';
    
// // // // // //     // Create colored icon
// // // // // //     const icon = createColoredMarkerIcon(markerColor);
    
// // // // // //     // Create marker with colored icon
// // // // // //     var marker = new H.map.Marker(coordinate, { icon: icon });
// // // // // //     marker.setData(html);
// // // // // //     group.addObject(marker);
// // // // // //   }

// // // // // //   function addInfoBubble(map, ui, markers) {
// // // // // //     var group = new H.map.Group();
// // // // // //     map.addObject(group);

// // // // // //     group.addEventListener("tap", function (evt) {
// // // // // //       var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
// // // // // //         content: evt.target.getData()
// // // // // //       });
// // // // // //       ui.addBubble(bubble);
// // // // // //     }, false);

// // // // // //     // Add each marker from fetched data
// // // // // //     markers.forEach(marker => {
// // // // // //       const html = `<div><strong>${marker.title}</strong></div><div>${marker.description}</div>`;
// // // // // //       addMarkerToGroup(group, { lat: marker.lat, lng: marker.lon }, html, marker.color);
// // // // // //     });
// // // // // //   }
// // // // // // })();

// // // // // (async () => {
// // // // //   const response = await fetch('http://localhost:3000/getMarkers');
// // // // //   const data = await response.json();
// // // // //   const markers = data.markers;
// // // // //   console.log(markers);

// // // // //   // Initialize HERE map
// // // // //   var platform = new H.service.Platform({
// // // // //     apikey: "fni7yJt1UNpagDbFd68KWE_0mOGAqlvsBWlQG6Kfyxg"
// // // // //   });

// // // // //   var defaultLayers = platform.createDefaultLayers();

// // // // //   var map = new H.Map(
// // // // //     document.getElementById('map'),
// // // // //     defaultLayers.vector.normal.map,
// // // // //     {
// // // // //       zoom: 17,
// // // // //       center: { lat: 19.123800599557097, lng: 72.83503128858327 },
// // // // //       pixelRatio: window.devicePixelRatio || 1
// // // // //     }
// // // // //   );

// // // // //   window.addEventListener('resize', () => map.getViewPort().resize());

// // // // //   var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
// // // // //   var ui = H.ui.UI.createDefault(map, defaultLayers);

// // // // //   addInfoBubble(map, ui, markers);

// // // // //   function createColoredMarkerIcon(color) {
// // // // //     const svg = `<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
// // // // //       <circle cx="12" cy="12" r="10" fill="${color}" stroke="#fff" stroke-width="2"/>
// // // // //     </svg>`;
// // // // //     return new H.map.Icon(
// // // // //       `data:image/svg+xml;base64,${btoa(svg)}`,
// // // // //       { size: { w: 24, h: 24 } }
// // // // //     );
// // // // //   }

// // // // //   function addMarkerToGroup(group, coordinate, html, color, title) {
// // // // //     const markerColor = color || '#3366cc';
// // // // //     const icon = createColoredMarkerIcon(markerColor);

// // // // //     // Main marker
// // // // //     var marker = new H.map.Marker(coordinate, { icon: icon });
// // // // //     marker.setData(html);
// // // // //     group.addObject(marker);

// // // // //     // Label marker
// // // // //     const labelDiv = document.createElement('div');
// // // // //     labelDiv.style.cssText = `
// // // // //       background: white;
// // // // //       padding: 2px 5px;
// // // // //       border: 1px solid #333;
// // // // //       border-radius: 4px;
// // // // //       white-space: nowrap;
// // // // //       font-size: 12px;
// // // // //       font-family: sans-serif;
// // // // //       transform: translateY(-120%);
// // // // //       box-shadow: 0px 1px 2px rgba(0,0,0,0.2);
// // // // //     `;
// // // // //     labelDiv.innerText = title;

// // // // //     const domIcon = new H.map.DomIcon(labelDiv);
// // // // //     const labelMarker = new H.map.DomMarker(coordinate, { icon: domIcon });
// // // // //     group.addObject(labelMarker);
// // // // //   }

// // // // //   function addInfoBubble(map, ui, markers) {
// // // // //     var group = new H.map.Group();
// // // // //     map.addObject(group);

// // // // //     group.addEventListener("tap", function (evt) {
// // // // //       var bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
// // // // //         content: evt.target.getData()
// // // // //       });
// // // // //       ui.addBubble(bubble);
// // // // //     }, false);

// // // // //     markers.forEach(marker => {
// // // // //       const html = `<div><strong>${marker.title}</strong></div><div>${marker.description}</div>`;
// // // // //       addMarkerToGroup(group, { lat: marker.lat, lng: marker.lon }, html, marker.color, marker.title);
// // // // //     });
// // // // //   }
// // // // // })();

// // // // (async () => {
// // // //   const response = await fetch('http://localhost:3000/getMarkers');
// // // //   const data = await response.json();
// // // //   const markers = data.markers;
// // // //   console.log(markers);

// // // //   // Initialize HERE map
// // // //   const platform = new H.service.Platform({
// // // //     apikey: "fni7yJt1UNpagDbFd68KWE_0mOGAqlvsBWlQG6Kfyxg"
// // // //   });

// // // //   // Create custom map style for a modern, clean look
// // // //   const mapStyle = {
// // // //     style: 'normal',
// // // //     version: 'newest',
// // // //     map: {
// // // //       'map.background.color': '#f5f7fa',
// // // //       'map.road.background.color': '#ffffff',
// // // //       'map.road.border.color': '#d1d5db',
// // // //       'map.water.color': '#60a5fa',
// // // //       'map.label.color': '#374151',
// // // //       'map.label.halo.color': 'rgba(255,255,255,0.8)'
// // // //     }
// // // //   };

// // // //   const defaultLayers = platform.createDefaultLayers({
// // // //     tileSize: 256,
// // // //     ppi: 320,
// // // //     style: mapStyle
// // // //   });

// // // //   const map = new H.Map(
// // // //     document.getElementById('map'),
// // // //     defaultLayers.vector.normal.map,
// // // //     {
// // // //       zoom: 17,
// // // //       center: { lat: 19.123800599557097, lng: 72.83503128858327 },
// // // //       pixelRatio: window.devicePixelRatio || 1,
// // // //       padding: { top: 80, right: 80, bottom: 80, left: 80 }
// // // //     }
// // // //   );

// // // //   // Ensure map resizes properly
// // // //   window.addEventListener('resize', () => map.getViewPort().resize());

// // // //   const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
// // // //   const ui = H.ui.UI.createDefault(map, defaultLayers);

// // // //   // Customize UI controls
// // // //   ui.getControl('zoom').setAlignment('right-middle');
// // // //   ui.getControl('mapsettings').setAlignment('right-middle');
// // // //   ui.getControl('scalebar').setAlignment('bottom-right');

// // // //   addInfoBubble(map, ui, markers);

// // // //   function createColoredMarkerIcon(color) {
// // // //     const svg = `
// // // //       <svg width="32" height="40" xmlns="http://www.w3.org/2000/svg">
// // // //         <path d="M16 0C9.2 0 4 5.2 4 12c0 8 12 28 12 28s12-20 12-28C28 5.2 22.8 0 16 0z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
// // // //         <circle cx="16" cy="12" r="6" fill="#ffffff" fill-opacity="0.8"/>
// // // //       </svg>`;
// // // //     return new H.map.Icon(
// // // //       `data:image/svg+xml;base64,${btoa(svg)}`,
// // // //       { size: { w: 32, h: 40 }, anchor: { x: 16, y: 40 } }
// // // //     );
// // // //   }

// // // //   function addMarkerToGroup(group, coordinate, html, color, title) {
// // // //     const markerColor = color || '#3b82f6';
// // // //     const icon = createColoredMarkerIcon(markerColor);

// // // //     // Main marker with animation
// // // //     const marker = new H.map.Marker(coordinate, { icon: icon, volatility: true });
// // // //     marker.setData(html);
// // // //     marker.addEventListener('pointerenter', () => {
// // // //       marker.setIcon(createColoredMarkerIcon('#2563eb')); // Darker color on hover
// // // //     });
// // // //     marker.addEventListener('pointerleave', () => {
// // // //       marker.setIcon(createColoredMarkerIcon(markerColor)); // Original color
// // // //     });
// // // //     group.addObject(marker);

// // // //     // Enhanced label marker
// // // //     const labelDiv = document.createElement('div');
// // // //     labelDiv.style.cssText = `
// // // //       background: linear-gradient(135deg, #ffffff, #f3f4f6);
// // // //       padding: 4px 8px;
// // // //       border-radius: 6px;
// // // //       border: 1px solid #e5e7eb;
// // // //       box-shadow: 0 2px 4px rgba(0,0,0,0.1);
// // // //       font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
// // // //       font-size: 13px;
// // // //       font-weight: 500;
// // // //       color: #1f2937;
// // // //       white-space: nowrap;
// // // //       transform: translateY(-150%) translateX(-50%);
// // // //       transition: transform 0.2s ease-in-out;
// // // //       pointer-events: none;
// // // //     `;
// // // //     labelDiv.innerText = title;

// // // //     const domIcon = new H.map.DomIcon(labelDiv);
// // // //     const labelMarker = new H.map.DomMarker(coordinate, { icon: domIcon });
// // // //     group.addObject(labelMarker);
// // // //   }

// // // //   function addInfoBubble(map, ui, markers) {
// // // //     const group = new H.map.Group();
// // // //     map.addObject(group);

// // // //     group.addEventListener('tap', (evt) => {
// // // //       const geometry = evt.target.getGeometry();
// // // //       const bubble = new H.ui.InfoBubble(geometry, {
// // // //         content: `
// // // //           <div style="
// // // //             background: #ffffff;
// // // //             padding: 12px 16px;
// // // //             border-radius: 8px;
// // // //             box-shadow: 0 4px 12px rgba(0,0,0,0.15);
// // // //             max-width: 300px;
// // // //             font-family: 'Inter', sans-serif;
// // // //             font-size: 14px;
// // // //             color: #1f2937;
// // // //           ">
// // // //             ${evt.target.getData()}
// // // //           </div>`
// // // //       });
// // // //       bubble.addEventListener('statechange', (e) => {
// // // //         if (e.target.getState() === H.ui.InfoBubble.State.CLOSED) {
// // // //           ui.removeBubble(bubble);
// // // //         }
// // // //       });
// // // //       ui.addBubble(bubble);
// // // //     }, false);

// // // //     markers.forEach(marker => {
// // // //       const html = `
// // // //         <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">${marker.title}</div>
// // // //         <div style="color: #4b5563; line-height: 1.4;">${marker.description}</div>
// // // //       `;
// // // //       addMarkerToGroup(group, { lat: marker.lat, lng: marker.lon }, html, marker.color, marker.title);
// // // //     });
// // // //   }

// // // //   // Add subtle map animation on load
// // // //   map.addEventListener('mapviewchange', () => {
// // // //     map.getViewPort().setPadding(80, 80, 80, 80);
// // // //   }, { once: true });
// // // // })();

// // // // (async () => {
// // // //   const response = await fetch('http://localhost:3000/getMarkers');
// // // //   const data = await response.json();
// // // //   const markers = data.markers;

// // // //   const platform = new H.service.Platform({
// // // //     apikey: "fni7yJt1UNpagDbFd68KWE_0mOGAqlvsBWlQG6Kfyxg"
// // // //   });

// // // //   const defaultLayers = platform.createDefaultLayers({
// // // //     tileSize: 256,
// // // //     ppi: 320
// // // //   });

// // // //   const map = new H.Map(
// // // //     document.getElementById('map'),
// // // //     defaultLayers.vector.normal.map,
// // // //     {
// // // //       zoom: 17,
// // // //       center: { lat: 19.123800599557097, lng: 72.83503128858327 },
// // // //       pixelRatio: window.devicePixelRatio || 1,
// // // //       padding: { top: 80, right: 80, bottom: 80, left: 80 }
// // // //     }
// // // //   );

// // // //   window.addEventListener('resize', () => map.getViewPort().resize());

// // // //   const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
// // // //   const ui = H.ui.UI.createDefault(map, defaultLayers);

// // // //   ui.getControl('zoom').setAlignment('right-middle');
// // // //   ui.getControl('mapsettings').setAlignment('right-middle');
// // // //   ui.getControl('scalebar').setAlignment('bottom-right');

// // // //   addInfoBubble(map, ui, markers);

// // // //   // ======= View Switcher UI =======
// // // //   const viewSelect = document.createElement('select');
// // // //   viewSelect.innerHTML = `
// // // //     <option value="normal">Normal</option>
// // // //     <option value="satellite">Satellite</option>
// // // //     <option value="terrain">Terrain</option>
// // // //     <option value="night">Night</option>
// // // //   `;
// // // //   viewSelect.style.cssText = `
// // // //     position: absolute;
// // // //     bottom: 10px;
// // // //     left: 10px;
// // // //     z-index: 999;
// // // //     padding: 6px 10px;
// // // //     font-size: 14px;
// // // //     border-radius: 6px;
// // // //     border: 1px solid #ccc;
// // // //     background: white;
// // // //     font-family: sans-serif;
// // // //   `;
// // // //   document.body.appendChild(viewSelect);

// // // //   viewSelect.addEventListener('change', function () {
// // // //     const val = this.value;
// // // //     if (val === 'normal') map.setBaseLayer(defaultLayers.vector.normal.map);
// // // //     if (val === 'satellite') map.setBaseLayer(defaultLayers.raster.satellite.map);
// // // //     if (val === 'terrain') map.setBaseLayer(defaultLayers.raster.terrain.map);
// // // //     if (val === 'night') map.setBaseLayer(defaultLayers.vector.normal.night);
// // // //   });

// // // //   // ==================================

// // // //   function createColoredMarkerIcon(color) {
// // // //     const svg = `
// // // //       <svg width="32" height="40" xmlns="http://www.w3.org/2000/svg">
// // // //         <path d="M16 0C9.2 0 4 5.2 4 12c0 8 12 28 12 28s12-20 12-28C28 5.2 22.8 0 16 0z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
// // // //         <circle cx="16" cy="12" r="6" fill="#ffffff" fill-opacity="0.8"/>
// // // //       </svg>`;
// // // //     return new H.map.Icon(
// // // //       `data:image/svg+xml;base64,${btoa(svg)}`,
// // // //       { size: { w: 32, h: 40 }, anchor: { x: 16, y: 40 } }
// // // //     );
// // // //   }

// // // //   function addMarkerToGroup(group, coordinate, html, color, title) {
// // // //     const markerColor = color || '#3b82f6';
// // // //     const icon = createColoredMarkerIcon(markerColor);

// // // //     const marker = new H.map.Marker(coordinate, { icon: icon, volatility: true });
// // // //     marker.setData(html);
// // // //     marker.addEventListener('pointerenter', () => {
// // // //       marker.setIcon(createColoredMarkerIcon('#2563eb'));
// // // //     });
// // // //     marker.addEventListener('pointerleave', () => {
// // // //       marker.setIcon(createColoredMarkerIcon(markerColor));
// // // //     });
// // // //     group.addObject(marker);

// // // //     const labelDiv = document.createElement('div');
// // // //     labelDiv.style.cssText = `
// // // //       background: linear-gradient(135deg, #ffffff, #f3f4f6);
// // // //       padding: 4px 8px;
// // // //       border-radius: 6px;
// // // //       border: 1px solid #e5e7eb;
// // // //       box-shadow: 0 2px 4px rgba(0,0,0,0.1);
// // // //       font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
// // // //       font-size: 13px;
// // // //       font-weight: 500;
// // // //       color: #1f2937;
// // // //       white-space: nowrap;
// // // //       transform: translateY(-150%) translateX(-50%);
// // // //       transition: transform 0.2s ease-in-out;
// // // //       pointer-events: none;
// // // //     `;
// // // //     labelDiv.innerText = title;

// // // //     const domIcon = new H.map.DomIcon(labelDiv);
// // // //     const labelMarker = new H.map.DomMarker(coordinate, { icon: domIcon });
// // // //     group.addObject(labelMarker);
// // // //   }

// // // //   function addInfoBubble(map, ui, markers) {
// // // //     const group = new H.map.Group();
// // // //     map.addObject(group);

// // // //     group.addEventListener('tap', (evt) => {
// // // //       const geometry = evt.target.getGeometry();
// // // //       const bubble = new H.ui.InfoBubble(geometry, {
// // // //         content: `
// // // //           <div style="
// // // //             background: #ffffff;
// // // //             padding: 12px 16px;
// // // //             border-radius: 8px;
// // // //             box-shadow: 0 4px 12px rgba(0,0,0,0.15);
// // // //             max-width: 300px;
// // // //             font-family: 'Inter', sans-serif;
// // // //             font-size: 14px;
// // // //             color: #1f2937;
// // // //           ">
// // // //             ${evt.target.getData()}
// // // //           </div>`
// // // //       });
// // // //       bubble.addEventListener('statechange', (e) => {
// // // //         if (e.target.getState() === H.ui.InfoBubble.State.CLOSED) {
// // // //           ui.removeBubble(bubble);
// // // //         }
// // // //       });
// // // //       ui.addBubble(bubble);
// // // //     }, false);

// // // //     markers.forEach(marker => {
// // // //       const html = `
// // // //         <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">${marker.title}</div>
// // // //         <div style="color: #4b5563; line-height: 1.4;">${marker.description}</div>
// // // //       `;
// // // //       addMarkerToGroup(group, { lat: marker.lat, lng: marker.lon }, html, marker.color, marker.title);
// // // //     });
// // // //   }

// // // //   map.addEventListener('mapviewchange', () => {
// // // //     map.getViewPort().setPadding(80, 80, 80, 80);
// // // //   }, { once: true });
// // // // })();

// // // (async () => {
// // //   const response = await fetch('http://localhost:3000/getMarkers');
// // //   const data = await response.json();
// // //   const markers = data.markers;

// // //   const platform = new H.service.Platform({
// // //     apikey: "fni7yJt1UNpagDbFd68KWE_0mOGAqlvsBWlQG6Kfyxg"
// // //   });

// // //   const defaultLayers = platform.createDefaultLayers({
// // //     tileSize: 256,
// // //     ppi: 320
// // //   });

// // //   const map = new H.Map(
// // //     document.getElementById('map'),
// // //     defaultLayers.vector.normal.map,
// // //     {
// // //       zoom: 17,
// // //       center: { lat: 19.123800599557097, lng: 72.83503128858327 },
// // //       pixelRatio: window.devicePixelRatio || 1,
// // //       padding: { top: 80, right: 80, bottom: 80, left: 80 }
// // //     }
// // //   );

// // //   window.addEventListener('resize', () => map.getViewPort().resize());

// // //   const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
// // //   const ui = H.ui.UI.createDefault(map, defaultLayers);

// // //   ui.getControl('zoom').setAlignment('right-middle');
// // //   ui.getControl('mapsettings').setAlignment('right-middle');
// // //   ui.getControl('scalebar').setAlignment('bottom-right');

// // //   // Variables to store start and end points
// // //   let startPoint = null;
// // //   let endPoint = null;
// // //   let routeGroup = new H.map.Group(); // Group for route and start/end markers
// // //   map.addObject(routeGroup);

// // //   // Function to create a colored marker icon
// // //   function createColoredMarkerIcon(color) {
// // //     const svg = `
// // //       <svg width="32" height="40" xmlns="http://www.w3.org/2000/svg">
// // //         <path d="M16 0C9.2 0 4 5.2 4 12c0 8 12 28 12 28s12-20 12-28C28 5.2 22.8 0 16 0z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
// // //         <circle cx="16" cy="12" r="6" fill="#ffffff" fill-opacity="0.8"/>
// // //       </svg>`;
// // //     return new H.map.Icon(
// // //       `data:image/svg+xml;base64,${btoa(svg)}`,
// // //       { size: { w: 32, h: 40 }, anchor: { x: 16, y: 40 } }
// // //     );
// // //   }

// // //   // Function to add a marker to a group
// // //   function addMarkerToGroup(group, coordinate, html, color, title) {
// // //     const markerColor = color || '#3b82f6';
// // //     const icon = createColoredMarkerIcon(markerColor);

// // //     const marker = new H.map.Marker(coordinate, { icon: icon, volatility: true });
// // //     marker.setData(html);
// // //     marker.addEventListener('pointerenter', () => {
// // //       marker.setIcon(createColoredMarkerIcon('#2563eb'));
// // //     });
// // //     marker.addEventListener('pointerleave', () => {
// // //       marker.setIcon(createColoredMarkerIcon(markerColor));
// // //     });
// // //     group.addObject(marker);

// // //     const labelDiv = document.createElement('div');
// // //     labelDiv.style.cssText = `
// // //       background: linear-gradient(135deg, #ffffff, #f3f4f6);
// // //       padding: 4px 8px;
// // //       border-radius: 6px;
// // //       border: 1px solid #e5e7eb;
// // //       box-shadow: 0 2px 4px rgba(0,0,0,0.1);
// // //       font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
// // //       font-size: 13px;
// // //       font-weight: 500;
// // //       color: #1f2937;
// // //       white-space: nowrap;
// // //       transform: translateY(-150%) translateX(-50%);
// // //       transition: transform 0.2s ease-in-out;
// // //       pointer-events: none;
// // //     `;
// // //     labelDiv.innerText = title;

// // //     const domIcon = new H.map.DomIcon(labelDiv);
// // //     const labelMarker = new H.map.DomMarker(coordinate, { icon: domIcon });
// // //     group.addObject(labelMarker);
// // //   }

// // //   // Function to add info bubbles for markers
// // //   function addInfoBubble(map, ui, markers) {
// // //     const group = new H.map.Group();
// // //     map.addObject(group);

// // //     group.addEventListener('tap', (evt) => {
// // //       const geometry = evt.target.getGeometry();
// // //       const bubble = new H.ui.InfoBubble(geometry, {
// // //         content: `
// // //           <div style="
// // //             background: #ffffff;
// // //             padding: 12px 16px;
// // //             border-radius: 8px;
// // //             box-shadow: 0 4px 12px rgba(0,0,0,0.15);
// // //             max-width: 300px;
// // //             font-family: 'Inter', sans-serif;
// // //             font-size: 14px;
// // //             color: #1f2937;
// // //           ">
// // //             ${evt.target.getData()}
// // //           </div>`
// // //       });
// // //       bubble.addEventListener('statechange', (e) => {
// // //         if (e.target.getState() === H.ui.InfoBubble.State.CLOSED) {
// // //           ui.removeBubble(bubble);
// // //         }
// // //       });
// // //       ui.addBubble(bubble);
// // //     }, false);

// // //     markers.forEach(marker => {
// // //       const html = `
// // //         <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">${marker.title}</div>
// // //         <div style="color: #4b5563; line-height: 1.4;">${marker.description}</div>
// // //       `;
// // //       addMarkerToGroup(group, { lat: marker.lat, lng: marker.lon }, html, marker.color, marker.title);
// // //     });
// // //   }

// // //   // Add existing markers to the map
// // //   addInfoBubble(map, ui, markers);

// // //   // View switcher UI
// // //   const viewSelect = document.createElement('select');
// // //   viewSelect.innerHTML = `
// // //     <option value="normal">Normal</option>
// // //     <option value="satellite">Satellite</option>
// // //     <option value="terrain">Terrain</option>
// // //     <option value="night">Night</option>
// // //   `;
// // //   viewSelect.style.cssText = `
// // //     position: absolute;
// // //     bottom: 10px;
// // //     left: 10px;
// // //     z-index: 999;
// // //     padding: 6px 10px;
// // //     font-size: 14px;
// // //     border-radius: 6px;
// // //     border: 1px solid #ccc;
// // //     background: white;
// // //     font-family: sans-serif;
// // //   `;
// // //   document.body.appendChild(viewSelect);

// // //   viewSelect.addEventListener('change', function () {
// // //     const val = this.value;
// // //     if (val === 'normal') map.setBaseLayer(defaultLayers.vector.normal.map);
// // //     if (val === 'satellite') map.setBaseLayer(defaultLayers.raster.satellite.map);
// // //     if (val === 'terrain') map.setBaseLayer(defaultLayers.raster.terrain.map);
// // //     if (val === 'night') map.setBaseLayer(defaultLayers.vector.normal.night);
// // //   });

// // //   // Button to calculate route
// // //   const calculateRouteButton = document.createElement('button');
// // //   calculateRouteButton.innerText = 'Calculate Safest Route';
// // //   calculateRouteButton.style.cssText = `
// // //     position: absolute;
// // //     bottom: 10px;
// // //     left: 130px;
// // //     z-index: 999;
// // //     padding: 6px 12px;
// // //     font-size: 14px;
// // //     border-radius: 6px;
// // //     border: 1px solid #ccc;
// // //     background: #28a745;
// // //     color: white;
// // //     cursor: pointer;
// // //     font-family: sans-serif;
// // //   `;
// // //   document.body.appendChild(calculateRouteButton);

// // //   // Instruction text for user
// // //   const instructionDiv = document.createElement('div');
// // //   instructionDiv.innerText = 'Click map to set Start (1st click) and End (2nd click) points.';
// // //   instructionDiv.style.cssText = `
// // //     position: absolute;
// // //     bottom: 50px;
// // //     left: 10px;
// // //     z-index: 999;
// // //     padding: 6px 10px;
// // //     font-size: 14px;
// // //     border-radius: 6px;
// // //     border: 1px solid #ccc;
// // //     background: white;
// // //     font-family: sans-serif;
// // //   `;
// // //   document.body.appendChild(instructionDiv);

// // //   // Handle map clicks to set start and end points
// // //   map.addEventListener('tap', (evt) => {
// // //     const coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
// // //     if (!startPoint) {
// // //       // Set start point
// // //       startPoint = coord;
// // //       addMarkerToGroup(routeGroup, startPoint, '<div>Start Point</div>', '#28a745', 'Start');
// // //       instructionDiv.innerText = 'Click map to set End point.';
// // //     } else if (!endPoint) {
// // //       // Set end point
// // //       endPoint = coord;
// // //       addMarkerToGroup(routeGroup, endPoint, '<div>End Point</div>', '#dc3545', 'End');
// // //       instructionDiv.innerText = 'Click "Calculate Safest Route" button.';
// // //       calculateRouteButton.disabled = false;
// // //     }
// // //   });

// // //   // Function to calculate the safest route
// // //   function calculateSafestRoute() {
// // //     if (!startPoint || !endPoint) {
// // //       alert('Please set both start and end points.');
// // //       return;
// // //     }

// // //     // Clear previous route
// // //     routeGroup.removeAll();

// // //     // Re-add start and end markers
// // //     addMarkerToGroup(routeGroup, startPoint, '<div>Start Point</div>', '#28a745', 'Start');
// // //     addMarkerToGroup(routeGroup, endPoint, '<div>End Point</div>', '#dc3545', 'End');

// // //     // Filter crime markers
// // //     const crimeMarkers = markers.filter(marker => marker.title.toLowerCase() === 'crime');

// // //     // Create avoid areas (100-meter radius around each crime marker)
// // //     const avoidAreas = crimeMarkers.map(marker => {
// // //       // Approximate 100 meters in degrees (1 degree ≈ 111,139 meters)
// // //       const radius = 100 / 111139; // 100 meters
// // //       return `${marker.lat - radius},${marker.lon - radius};${marker.lat + radius},${marker.lon + radius}`;
// // //     }).join('|');

// // //     // Initialize routing service
// // //     const router = platform.getRoutingService(null, 8);

// // //     // Routing parameters
// // //     const routingParameters = {
// // //       transportMode: 'pedestrian',
// // //       origin: `${startPoint.lat},${startPoint.lng}`,
// // //       destination: `${endPoint.lat},${endPoint.lng}`,
// // //       return: 'polyline,summary',
// // //       ...(avoidAreas && { avoidAreas: avoidAreas }) // Add avoid areas if present
// // //     };

// // //     // Calculate route
// // //     router.calculateRoute(routingParameters, (result) => {
// // //       if (result.routes && result.routes.length > 0) {
// // //         const route = result.routes[0];
// // //         const routeShape = route.sections[0].polyline;

// // //         // Convert polyline to geometry
// // //         const linestring = H.geo.LineString.fromFlexiblePolyline(routeShape);
// // //         const polyline = new H.map.Polyline(linestring, {
// // //           style: { lineWidth: 4, strokeColor: '#28a745' }
// // //         });

// // //         // Add route to map
// // //         routeGroup.addObject(polyline);

// // //         // Zoom to route
// // //         map.getViewModel().setLookAtData({
// // //           bounds: polyline.getBoundingBox()
// // //         });

// // //         // Display route summary
// // //         const summary = route.sections[0].summary;
// // //         instructionDiv.innerText = `Route calculated: ${summary.length} meters, ~${Math.round(summary.travelTime / 60)} minutes`;
// // //       } else {
// // //         instructionDiv.innerText = 'No safe route found. Try different points.';
// // //       }
// // //     }, (error) => {
// // //       console.error('Routing error:', error);
// // //       instructionDiv.innerText = 'Error calculating route. Please try again.';
// // //     });
// // //   }

// // //   // Disable route button until both points are set
// // //   calculateRouteButton.disabled = true;
// // //   calculateRouteButton.addEventListener('click', calculateSafestRoute);

// // //   // Reset functionality
// // //   const resetButton = document.createElement('button');
// // //   resetButton.innerText = 'Reset Points';
// // //   resetButton.style.cssText = `
// // //     position: absolute;
// // //     bottom: 10px;
// // //     left: 300px;
// // //     z-index: 999;
// // //     padding: 6px 12px;
// // //     font-size: 14px;
// // //     border-radius: 6px;
// // //     border: 1px solid #ccc;
// // //     background: #dc3545;
// // //     color: white;
// // //     cursor: pointer;
// // //     font-family: sans-serif;
// // //   `;
// // //   document.body.appendChild(resetButton);

// // //   resetButton.addEventListener('click', () => {
// // //     startPoint = null;
// // //     endPoint = null;
// // //     routeGroup.removeAll();
// // //     instructionDiv.innerText = 'Click map to set Start (1st click) and End (2nd click) points.';
// // //     calculateRouteButton.disabled = true;
// // //   });

// // //   map.addEventListener('mapviewchange', () => {
// // //     map.getViewPort().setPadding(80, 80, 80, 80);
// // //   }, { once: true });
// // // })();

// // (async () => {
// //   const response = await fetch('http://localhost:3000/getMarkers');
// //   const data = await response.json();
// //   const markers = data.markers;

// //   const platform = new H.service.Platform({
// //     apikey: "fni7yJt1UNpagDbFd68KWE_0mOGAqlvsBWlQG6Kfyxg"
// //   });

// //   const defaultLayers = platform.createDefaultLayers({
// //     tileSize: 256,
// //     ppi: 320
// //   });

// //   const map = new H.Map(
// //     document.getElementById('map'),
// //     defaultLayers.vector.normal.map,
// //     {
// //       zoom: 17,
// //       center: { lat: 19.123800599557097, lng: 72.83503128858327 },
// //       pixelRatio: window.devicePixelRatio || 1,
// //       padding: { top: 80, right: 80, bottom: 80, left: 80 }
// //     }
// //   );

// //   window.addEventListener('resize', () => map.getViewPort().resize());

// //   const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
// //   const ui = H.ui.UI.createDefault(map, defaultLayers);

// //   ui.getControl('zoom').setAlignment('right-middle');
// //   ui.getControl('mapsettings').setAlignment('right-middle');
// //   ui.getControl('scalebar').setAlignment('bottom-right');

// //   // Variables to store start and end points
// //   let startPoint = null;
// //   let endPoint = null;
// //   let routeGroup = new H.map.Group(); // Group for route and start/end markers
// //   let crimeAreaGroup = new H.map.Group(); // Group for crime area rectangles
// //   map.addObject(routeGroup);
// //   map.addObject(crimeAreaGroup);

// //   // Function to create a colored marker icon
// //   function createColoredMarkerIcon(color) {
// //     const svg = `
// //       <svg width="32" height="40" xmlns="http://www.w3.org/2000/svg">
// //         <path d="M16 0C9.2 0 4 5.2 4 12c0 8 12 28 12 28s12-20 12-28C28 5.2 22.8 0 16 0z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
// //         <circle cx="16" cy="12" r="6" fill="#ffffff" fill-opacity="0.8"/>
// //       </svg>`;
// //     return new H.map.Icon(
// //       `data:image/svg+xml;base64,${btoa(svg)}`,
// //       { size: { w: 32, h: 40 }, anchor: { x: 16, y: 40 } }
// //     );
// //   }

// //   // Function to add a marker to a group
// //   function addMarkerToGroup(group, coordinate, html, color, title) {
// //     const markerColor = color || '#3b82f6';
// //     const icon = createColoredMarkerIcon(markerColor);

// //     const marker = new H.map.Marker(coordinate, { icon: icon, volatility: true });
// //     marker.setData(html);
// //     marker.addEventListener('pointerenter', () => {
// //       marker.setIcon(createColoredMarkerIcon('#2563eb'));
// //     });
// //     marker.addEventListener('pointerleave', () => {
// //       marker.setIcon(createColoredMarkerIcon(markerColor));
// //     });
// //     group.addObject(marker);

// //     const labelDiv = document.createElement('div');
// //     labelDiv.style.cssText = `
// //       background: linear-gradient(135deg, #ffffff, #f3f4f6);
// //       padding: 4px 8px;
// //       border-radius: 6px;
// //       border: 1px solid #e5e7eb;
// //       box-shadow: 0 2px 4px rgba(0,0,0,0.1);
// //       font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
// //       font-size: 13px;
// //       font-weight: 500;
// //       color: #1f2937;
// //       white-space: nowrap;
// //       transform: translateY(-150%) translateX(-50%);
// //       transition: transform 0.2s ease-in-out;
// //       pointer-events: none;
// //     `;
// //     labelDiv.innerText = title;

// //     const domIcon = new H.map.DomIcon(labelDiv);
// //     const labelMarker = new H.map.DomMarker(coordinate, { icon: domIcon });
// //     group.addObject(labelMarker);
// //   }

// //   // Function to add info bubbles for markers
// //   function addInfoBubble(map, ui, markers) {
// //     const group = new H.map.Group();
// //     map.addObject(group);

// //     group.addEventListener('tap', (evt) => {
// //       const geometry = evt.target.getGeometry();
// //       const bubble = new H.ui.InfoBubble(geometry, {
// //         content: `
// //           <div style="
// //             background: #ffffff;
// //             padding: 12px 16px;
// //             border-radius: 8px;
// //             box-shadow: 0 4px 12px rgba(0,0,0,0.15);
// //             max-width: 300px;
// //             font-family: 'Inter', sans-serif;
// //             font-size: 14px;
// //             color: #1f2937;
// //           ">
// //             ${evt.target.getData()}
// //           </div>`
// //       });
// //       bubble.addEventListener('statechange', (e) => {
// //         if (e.target.getState() === H.ui.InfoBubble.State.CLOSED) {
// //           ui.removeBubble(bubble);
// //         }
// //       });
// //       ui.addBubble(bubble);
// //     }, false);

// //     markers.forEach(marker => {
// //       const html = `
// //         <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">${marker.title}</div>
// //         <div style="color: #4b5563; line-height: 1.4;">${marker.description}</div>
// //       `;
// //       addMarkerToGroup(group, { lat: marker.lat, lng: marker.lon }, html, marker.color, marker.title);
// //     });
// //   }

// //   // Add existing markers to the map
// //   addInfoBubble(map, ui, markers);

// //   // View switcher UI
// //   const viewSelect = document.createElement('select');
// //   viewSelect.innerHTML = `
// //     <option value="normal">Normal</option>
// //     <option value="satellite">Satellite</option>
// //     <option value="terrain">Terrain</option>
// //     <option value="night">Night</option>
// //   `;
// //   viewSelect.style.cssText = `
// //     position: absolute;
// //     bottom: 10px;
// //     left: 10px;
// //     z-index: 999;
// //     padding: 6px 10px;
// //     font-size: 14px;
// //     border-radius: 6px;
// //     border: 1px solid #ccc;
// //     background: white;
// //     font-family: sans-serif;
// //   `;
// //   document.body.appendChild(viewSelect);

// //   viewSelect.addEventListener('change', function () {
// //     const val = this.value;
// //     if (val === 'normal') map.setBaseLayer(defaultLayers.vector.normal.map);
// //     if (val === 'satellite') map.setBaseLayer(defaultLayers.raster.satellite.map);
// //     if (val === 'terrain') map.setBaseLayer(defaultLayers.raster.terrain.map);
// //     if (val === 'night') map.setBaseLayer(defaultLayers.vector.normal.night);
// //   });

// //   // Button to calculate route
// //   const calculateRouteButton = document.createElement('button');
// //   calculateRouteButton.innerText = 'Calculate Safest Route';
// //   calculateRouteButton.style.cssText = `
// //     position: absolute;
// //     bottom: 10px;
// //     left: 130px;
// //     z-index: 999;
// //     padding: 6px 12px;
// //     font-size: 14px;
// //     border-radius: 6px;
// //     border: 1px solid #ccc;
// //     background: #28a745;
// //     color: white;
// //     cursor: pointer;
// //     font-family: sans-serif;
// //   `;
// //   document.body.appendChild(calculateRouteButton);

// //   // Instruction text for user
// //   const instructionDiv = document.createElement('div');
// //   instructionDiv.innerText = 'Click map to set Start (1st click) and End (2nd click) points.';
// //   instructionDiv.style.cssText = `
// //     position: absolute;
// //     bottom: 50px;
// //     left: 10px;
// //     z-index: 999;
// //     padding: 6px 10px;
// //     font-size: 14px;
// //     border-radius: 6px;
// //     border: 1px solid #ccc;
// //     background: white;
// //     font-family: sans-serif;
// //   `;
// //   document.body.appendChild(instructionDiv);

// //   // Handle map clicks to set start and end points
// //   map.addEventListener('tap', (evt) => {
// //     const coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
// //     if (!startPoint) {
// //       // Set start point
// //       startPoint = coord;
// //       addMarkerToGroup(routeGroup, startPoint, '<div>Start Point</div>', '#28a745', 'Start');
// //       instructionDiv.innerText = 'Click map to set End point.';
// //     } else if (!endPoint) {
// //       // Set end point
// //       endPoint = coord;
// //       addMarkerToGroup(routeGroup, endPoint, '<div>End Point</div>', '#dc3545', 'End');
// //       instructionDiv.innerText = 'Click "Calculate Safest Route" button.';
// //       calculateRouteButton.disabled = false;
// //     }
// //   });

// //   // Function to calculate the safest route and show crime area bounding boxes
// //   function calculateSafestRoute() {
// //     if (!startPoint || !endPoint) {
// //       alert('Please set both start and end points.');
// //       return;
// //     }

// //     // Clear previous route and crime areas
// //     routeGroup.removeAll();
// //     crimeAreaGroup.removeAll();

// //     // Re-add start and end markers
// //     addMarkerToGroup(routeGroup, startPoint, '<div>Start Point</div>', '#28a745', 'Start');
// //     addMarkerToGroup(routeGroup, endPoint, '<div>End Point</div>', '#dc3545', 'End');

// //     // Filter crime markers
// //     const crimeMarkers = markers.filter(marker => marker.title.toLowerCase() === 'crime');

// //     // Create avoid areas and add bounding box rectangles (100-meter radius)
// //     const avoidAreas = crimeMarkers.map(marker => {
// //       // Approximate 100 meters in degrees (1 degree ≈ 111,139 meters)
// //       const radius = 100 / 111139; // 100 meters
// //       const southWest = { lat: marker.lat - radius, lng: marker.lon - radius };
// //       const northEast = { lat: marker.lat + radius, lng: marker.lon + radius };

// //       // Add rectangle to crimeAreaGroup
// //       const rectangle = new H.map.Rect(
// //         new H.geo.Rect(
// //           northEast.lat,
// //           southWest.lng,
// //           southWest.lat,
// //           northEast.lng
// //         ),
// //         {
// //           style: {
// //             fillColor: 'rgba(255, 0, 0, 0.2)', // Semi-transparent red
// //             strokeColor: '#ff0000',
// //             lineWidth: 2
// //           }
// //         }
// //       );
// //       crimeAreaGroup.addObject(rectangle);

// //       // Return avoid area string for routing
// //       return `${southWest.lat},${southWest.lng};${northEast.lat},${northEast.lng}`;
// //     }).join('|');

// //     // Initialize routing service
// //     const router = platform.getRoutingService(null, 8);

// //     // Routing parameters
// //     const routingParameters = {
// //       transportMode: 'pedestrian',
// //       origin: `${startPoint.lat},${startPoint.lng}`,
// //       destination: `${endPoint.lat},${endPoint.lng}`,
// //       return: 'polyline,summary',
// //       ...(avoidAreas && { avoidAreas: avoidAreas }) // Add avoid areas if present
// //     };

// //     // Calculate route
// //     router.calculateRoute(routingParameters, (result) => {
// //       if (result.routes && result.routes.length > 0) {
// //         const route = result.routes[0];
// //         const routeShape = route.sections[0].polyline;

// //         // Convert polyline to geometry
// //         const linestring = H.geo.LineString.fromFlexiblePolyline(routeShape);
// //         const polyline = new H.map.Polyline(linestring, {
// //           style: { lineWidth: 4, strokeColor: '#28a745' }
// //         });

// //         // Add route to map
// //         routeGroup.addObject(polyline);

// //         // Zoom to route
// //         map.getViewModel().setLookAtData({
// //           bounds: polyline.getBoundingBox()
// //         });

// //         // Display route summary
// //         const summary = route.sections[0].summary;
// //         instructionDiv.innerText = `Route calculated: ${summary.length} meters, ~${Math.round(summary.travelTime / 60)} minutes`;
// //       } else {
// //         instructionDiv.innerText = 'No safe route found. Try different points.';
// //       }
// //     }, (error) => {
// //       console.error('Routing error:', error);
// //       instructionDiv.innerText = 'Error calculating route. Please try again.';
// //     });
// //   }

// //   // Disable route button until both points are set
// //   calculateRouteButton.disabled = true;
// //   calculateRouteButton.addEventListener('click', calculateSafestRoute);

// //   // Reset functionality
// //   const resetButton = document.createElement('button');
// //   resetButton.innerText = 'Reset Points';
// //   resetButton.style.cssText = `
// //     position: absolute;
// //     bottom: 10px;
// //     left: 300px;
// //     z-index: 999;
// //     padding: 6px 12px;
// //     font-size: 14px;
// //     border-radius: 6px;
// //     border: 1px solid #ccc;
// //     background: #dc3545;
// //     color: white;
// //     cursor: pointer;
// //     font-family: sans-serif;
// //   `;
// //   document.body.appendChild(resetButton);

// //   resetButton.addEventListener('click', () => {
// //     startPoint = null;
// //     endPoint = null;
// //     routeGroup.removeAll();
// //     crimeAreaGroup.removeAll();
// //     instructionDiv.innerText = 'Click map to set Start (1st click) and End (2nd click) points.';
// //     calculateRouteButton.disabled = true;
// //   });

// //   map.addEventListener('mapviewchange', () => {
// //     map.getViewPort().setPadding(80, 80, 80, 80);
// //   }, { once: true });
// // })();

// (async () => {
//   const response = await fetch('http://localhost:3000/getMarkers');
//   const data = await response.json();
//   const markers = data.markers;

//   const platform = new H.service.Platform({
//     apikey: "fni7yJt1UNpagDbFd68KWE_0mOGAqlvsBWlQG6Kfyxg"
//   });

//   const defaultLayers = platform.createDefaultLayers({
//     tileSize: 256,
//     ppi: 320
//   });

//   const map = new H.Map(
//     document.getElementById('map'),
//     defaultLayers.vector.normal.map,
//     {
//       zoom: 17,
//       center: { lat: 19.123800599557097, lng: 72.83503128858327 },
//       pixelRatio: window.devicePixelRatio || 1,
//       padding: { top: 80, right: 80, bottom: 80, left: 80 }
//     }
//   );

//   window.addEventListener('resize', () => map.getViewPort().resize());

//   const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
//   const ui = H.ui.UI.createDefault(map, defaultLayers);

//   ui.getControl('zoom').setAlignment('right-middle');
//   ui.getControl('mapsettings').setAlignment('right-middle');
//   ui.getControl('scalebar').setAlignment('bottom-right');

//   // Variables to store start and end points
//   let startPoint = null;
//   let endPoint = null;
//   let routeGroup = new H.map.Group(); // Group for route and start/end markers
//   let crimeAreaGroup = new H.map.Group(); // Group for crime area rectangles
//   map.addObject(routeGroup);
//   map.addObject(crimeAreaGroup);

//   // Function to create a colored marker icon
//   function createColoredMarkerIcon(color) {
//     const svg = `
//       <svg width="32" height="40" xmlns="http://www.w3.org/2000/svg">
//         <path d="M16 0C9.2 0 4 5.2 4 12c0 8 12 28 12 28s12-20 12-28C28 5.2 22.8 0 16 0z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
//         <circle cx="16" cy="12" r="6" fill="#ffffff" fill-opacity="0.8"/>
//       </svg>`;
//     return new H.map.Icon(
//       `data:image/svg+xml;base64,${btoa(svg)}`,
//       { size: { w: 32, h: 40 }, anchor: { x: 16, y: 40 } }
//     );
//   }

//   // Function to add a marker to a group
//   function addMarkerToGroup(group, coordinate, html, color, title) {
//     const markerColor = color || '#3b82f6';
//     const icon = createColoredMarkerIcon(markerColor);

//     const marker = new H.map.Marker(coordinate, { icon: icon, volatility: true });
//     marker.setData(html);
//     marker.addEventListener('pointerenter', () => {
//       marker.setIcon(createColoredMarkerIcon('#2563eb'));
//     });
//     marker.addEventListener('pointerleave', () => {
//       marker.setIcon(createColoredMarkerIcon(markerColor));
//     });
//     group.addObject(marker);

//     const labelDiv = document.createElement('div');
//     labelDiv.style.cssText = `
//       background: linear-gradient(135deg, #ffffff, #f3f4f6);
//       padding: 4px 8px;
//       border-radius: 6px;
//       border: 1px solid #e5e7eb;
//       box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//       font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
//       font-size: 13px;
//       font-weight: 500;
//       color: #1f2937;
//       white-space: nowrap;
//       transform: translateY(-150%) translateX(-50%);
//       transition: transform 0.2s ease-in-out;
//       pointer-events: none;
//     `;
//     labelDiv.innerText = title;

//     const domIcon = new H.map.DomIcon(labelDiv);
//     const labelMarker = new H.map.DomMarker(coordinate, { icon: domIcon });
//     group.addObject(labelMarker);
//   }

//   // Function to add info bubbles for markers
//   function addInfoBubble(map, ui, markers) {
//     const group = new H.map.Group();
//     map.addObject(group);

//     group.addEventListener('tap', (evt) => {
//       const geometry = evt.target.getGeometry();
//       const bubble = new H.ui.InfoBubble(geometry, {
//         content: `
//           <div style="
//             background: #ffffff;
//             padding: 12px 16px;
//             border-radius: 8px;
//             box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//             max-width: 300px;
//             font-family: 'Inter', sans-serif;
//             font-size: 14px;
//             color: #1f2937;
//           ">
//             ${evt.target.getData()}
//           </div>`
//       });
//       bubble.addEventListener('statechange', (e) => {
//         if (e.target.getState() === H.ui.InfoBubble.State.CLOSED) {
//           ui.removeBubble(bubble);
//         }
//       });
//       ui.addBubble(bubble);
//     }, false);

//     markers.forEach(marker => {
//       const html = `
//         <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">${marker.title}</div>
//         <div style="color: #4b5563; line-height: 1.4;">${marker.description}</div>
//       `;
//       addMarkerToGroup(group, { lat: marker.lat, lng: marker.lon }, html, marker.color, marker.title);
//     });
//   }

//   // Add existing markers to the map
//   addInfoBubble(map, ui, markers);

//   // View switcher UI
//   const viewSelect = document.createElement('select');
//   viewSelect.innerHTML = `
//     <option value="normal">Normal</option>
//     <option value="satellite">Satellite</option>
//     <option value="terrain">Terrain</option>
//     <option value="night">Night</option>
//   `;
//   viewSelect.style.cssText = `
//     position: absolute;
//     bottom: 10px;
//     left: 10px;
//     z-index: 999;
//     padding: 6px 10px;
//     font-size: 14px;
//     border-radius: 6px;
//     border: 1px solid #ccc;
//     background: white;
//     font-family: sans-serif;
//   `;
//   document.body.appendChild(viewSelect);

//   viewSelect.addEventListener('change', function () {
//     const val = this.value;
//     if (val === 'normal') map.setBaseLayer(defaultLayers.vector.normal.map);
//     if (val === 'satellite') map.setBaseLayer(defaultLayers.raster.satellite.map);
//     if (val === 'terrain') map.setBaseLayer(defaultLayers.raster.terrain.map);
//     if (val === 'night') map.setBaseLayer(defaultLayers.vector.normal.night);
//   });

//   // Button to calculate route
//   const calculateRouteButton = document.createElement('button');
//   calculateRouteButton.innerText = 'Calculate Safest Route';
//   calculateRouteButton.style.cssText = `
//     position: absolute;
//     bottom: 10px;
//     left: 130px;
//     z-index: 999;
//     padding: 6px 12px;
//     font-size: 14px;
//     border-radius: 6px;
//     border: 1px solid #ccc;
//     background: #28a745;
//     color: white;
//     cursor: pointer;
//     font-family: sans-serif;
//   `;
//   document.body.appendChild(calculateRouteButton);

//   // Instruction text for user
//   const instructionDiv = document.createElement('div');
//   instructionDiv.innerText = 'Click map to set Start (1st click) and End (2nd click) points.';
//   instructionDiv.style.cssText = `
//     position: absolute;
//     bottom: 50px;
//     left: 10px;
//     z-index: 999;
//     padding: 6px 10px;
//     font-size: 14px;
//     border-radius: 6px;
//     border: 1px solid #ccc;
//     background: white;
//     font-family: sans-serif;
//   `;
//   document.body.appendChild(instructionDiv);

//   // Handle map clicks to set start and end points
//   map.addEventListener('tap', (evt) => {
//     const coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
//     if (!startPoint) {
//       // Set start point
//       startPoint = coord;
//       addMarkerToGroup(routeGroup, startPoint, '<div>Start Point</div>', '#28a745', 'Start');
//       instructionDiv.innerText = 'Click map to set End point.';
//     } else if (!endPoint) {
//       // Set end point
//       endPoint = coord;
//       addMarkerToGroup(routeGroup, endPoint, '<div>End Point</div>', '#dc3545', 'End');
//       instructionDiv.innerText = 'Click "Calculate Safest Route" button.';
//       calculateRouteButton.disabled = false;
//     }
//   });

//   // Function to check if a point is inside any crime bounding box
//   function isPointInCrimeArea(point, crimeMarkers) {
//     const radius = 100 / 111139; // 100 meters in degrees
//     return crimeMarkers.some(marker => {
//       const southWest = { lat: marker.lat - radius, lng: marker.lon - radius };
//       const northEast = { lat: marker.lat + radius, lng: marker.lon + radius };
//       return (
//         point.lat >= southWest.lat &&
//         point.lat <= northEast.lat &&
//         point.lng >= southWest.lng &&
//         point.lng <= northEast.lng
//       );
//     });
//   }

//   // Function to calculate the safest route and show crime area bounding boxes
//   function calculateSafestRoute() {
//     if (!startPoint || !endPoint) {
//       alert('Please set both start and end points.');
//       return;
//     }

//     // Check if start or end points are in crime areas
//     const crimeMarkers = markers.filter(marker => marker.title.toLowerCase() === 'crime');
//     if (isPointInCrimeArea(startPoint, crimeMarkers) || isPointInCrimeArea(endPoint, crimeMarkers)) {
//       instructionDiv.innerText = 'Start or End point is in a crime area. Please choose different points.';
//       return;
//     }

//     // Clear previous route and crime areas
//     routeGroup.removeAll();
//     crimeAreaGroup.removeAll();

//     // Re-add start and end markers
//     addMarkerToGroup(routeGroup, startPoint, '<div>Start Point</div>', '#28a745', 'Start');
//     addMarkerToGroup(routeGroup, endPoint, '<div>End Point</div>', '#dc3545', 'End');

//     // Create avoid areas and add bounding box rectangles (100-meter radius)
//     const avoidAreas = crimeMarkers.map(marker => {
//       console.log(marker)
//       // Approximate 100 meters in degrees (1 degree ≈ 111,139 meters)
//       const radius = 100 / 111139; // 100 meters
//       const southWest = { lat: marker.lat - radius, lng: marker.lon - radius };
//       const northEast = { lat: marker.lat + radius, lng: marker.lon + radius };

//       // Add rectangle to crimeAreaGroup
//       const rectangle = new H.map.Rect(
//         new H.geo.Rect(
//           northEast.lat,
//           southWest.lng,
//           southWest.lat,
//           northEast.lng
//         ),
//         {
//           style: {
//             fillColor: 'rgba(255, 0, 0, 0.2)', // Semi-transparent red
//             strokeColor: '#ff0000',
//             lineWidth: 2
//           }
//         }
//       );
//       crimeAreaGroup.addObject(rectangle);

//       // Return avoid area string for routing
//       return `${southWest.lat},${southWest.lng};${northEast.lat},${northEast.lng}`;
//     }).join('|');

//     // Initialize routing service
//     const router = platform.getRoutingService(null, 8);

//     // Routing parameters with strict avoidance
//     const routingParameters = {
//       transportMode: 'pedestrian',
//       origin: `${startPoint.lat},${startPoint.lng}`,
//       destination: `${endPoint.lat},${endPoint.lng}`,
//       return: 'polyline,summary',
//       ...(avoidAreas && { avoidAreas: avoidAreas }), // Add avoid areas if present
//       routeAttributes: ['avoidAreas'], // Ensure avoid areas are strictly respected
//       alternatives: 0 // Disable alternative routes to prioritize strict avoidance
//     };

//     // Calculate route
//     router.calculateRoute(routingParameters, (result) => {
//       if (result.routes && result.routes.length > 0) {
//         const route = result.routes[0];
//         const routeShape = route.sections[0].polyline;

//         // Convert polyline to geometry
//         const linestring = H.geo.LineString.fromFlexiblePolyline(routeShape);
//         const polyline = new H.map.Polyline(linestring, {
//           style: { lineWidth: 4, strokeColor: '#28a745' }
//         });

//         // Add route to map
//         routeGroup.addObject(polyline);

//         // Zoom to route
//         map.getViewModel().setLookAtData({
//           bounds: polyline.getBoundingBox()
//         });

//         // Display route summary
//         const summary = route.sections[0].summary;
//         instructionDiv.innerText = `Route calculated: ${summary.length} meters, ~${Math.round(summary.travelTime / 60)} minutes`;
//       } else {
//         instructionDiv.innerText = 'No route found that avoids all crime areas. Try different points or adjust crime areas.';
//       }
//     }, (error) => {
//       console.error('Routing error:', error);
//       instructionDiv.innerText = 'Error calculating route. Crime areas may be unavoidable. Please try different points.';
//     });
//   }

//   // Disable route button until both points are set
//   calculateRouteButton.disabled = true;
//   calculateRouteButton.addEventListener('click', calculateSafestRoute);

//   // Reset functionality
//   const resetButton = document.createElement('button');
//   resetButton.innerText = 'Reset Points';
//   resetButton.style.cssText = `
//     position: absolute;
//     bottom: 10px;
//     left: 300px;
//     z-index: 999;
//     padding: 6px 12px;
//     font-size: 14px;
//     border-radius: 6px;
//     border: 1px solid #ccc;
//     background: #dc3545;
//     color: white;
//     cursor: pointer;
//     font-family: sans-serif;
//   `;
//   document.body.appendChild(resetButton);

//   resetButton.addEventListener('click', () => {
//     startPoint = null;
//     endPoint = null;
//     routeGroup.removeAll();
//     crimeAreaGroup.removeAll();
//     instructionDiv.innerText = 'Click map to set Start (1st click) and End (2nd click) points.';
//     calculateRouteButton.disabled = true;
//   });

//   map.addEventListener('mapviewchange', () => {
//     map.getViewPort().setPadding(80, 80, 80, 80);
//   }, { once: true });
// })();

(async () => {
  const response = await fetch('http://10.10.116.97:4000/getMarkers');
  const data = await response.json();
  const markers = data.markers;

  const platform = new H.service.Platform({
    apikey: "fni7yJt1UNpagDbFd68KWE_0mOGAqlvsBWlQG6Kfyxg"
  });

  const defaultLayers = platform.createDefaultLayers({
    tileSize: 256,
    ppi: 320
  });

  const map = new H.Map(
    document.getElementById('map'),
    defaultLayers.vector.normal.map,
    {
      zoom: 17,
      center: { lat: 19.123800599557097, lng: 72.83503128858327 },
      pixelRatio: window.devicePixelRatio || 1,
      padding: { top: 80, right: 80, bottom: 80, left: 80 }
    }
  );

  window.addEventListener('resize', () => map.getViewPort().resize());

  const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  const ui = H.ui.UI.createDefault(map, defaultLayers);

  ui.getControl('zoom').setAlignment('right-middle');
  ui.getControl('mapsettings').setAlignment('right-middle');
  ui.getControl('scalebar').setAlignment('bottom-right');

  // Variables to store start and end points
  let startPoint = null;
  let endPoint = null;
  let routeGroup = new H.map.Group(); // Group for route and start/end markers
  let crimeAreaGroup = new H.map.Group(); // Group for crime area circles
  map.addObject(routeGroup);
  map.addObject(crimeAreaGroup);

  // Function to create a colored marker icon
  function createColoredMarkerIcon(color) {
    const svg = `
      <svg width="32" height="40" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C9.2 0 4 5.2 4 12c0 8 12 28 12 28s12-20 12-28C28 5.2 22.8 0 16 0z" fill="${color}" stroke="#ffffff" stroke-width="2"/>
        <circle cx="16" cy="12" r="6" fill="#ffffff" fill-opacity="0.8"/>
      </svg>`;
    return new H.map.Icon(
      `data:image/svg+xml;base64,${btoa(svg)}`,
      { size: { w: 32, h: 40 }, anchor: { x: 16, y: 40 } }
    );
  }

  // Function to add a marker to a group
  function addMarkerToGroup(group, coordinate, html, color, title) {
    const markerColor = color || '#3b82f6';
    const icon = createColoredMarkerIcon(markerColor);

    const marker = new H.map.Marker(coordinate, { icon: icon, volatility: true });
    marker.setData(html);
    marker.addEventListener('pointerenter', () => {
      marker.setIcon(createColoredMarkerIcon('#2563eb'));
    });
    marker.addEventListener('pointerleave', () => {
      marker.setIcon(createColoredMarkerIcon(markerColor));
    });
    group.addObject(marker);

    const labelDiv = document.createElement('div');
    labelDiv.style.cssText = `
      background: linear-gradient(135deg, #ffffff, #f3f4f6);
      padding: 4px 8px;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 13px;
      font-weight: 500;
      color: #1f2937;
      white-space: nowrap;
      transform: translateY(-150%) translateX(-50%);
      transition: transform 0.2s ease-in-out;
      pointer-events: none;
    `;
    labelDiv.innerText = title;

    const domIcon = new H.map.DomIcon(labelDiv);
    const labelMarker = new H.map.DomMarker(coordinate, { icon: domIcon });
    group.addObject(labelMarker);
  }

  // Function to add info bubbles for markers
  function addInfoBubble(map, ui, markers) {
    const group = new H.map.Group();
    map.addObject(group);

    group.addEventListener('tap', (evt) => {
      const geometry = evt.target.getGeometry();
      const bubble = new H.ui.InfoBubble(geometry, {
        content: `
          <div style="
            background: #ffffff;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 300px;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            color: #1f2937;
          ">
            ${evt.target.getData()}
          </div>`
      });
      bubble.addEventListener('statechange', (e) => {
        if (e.target.getState() === H.ui.InfoBubble.State.CLOSED) {
          ui.removeBubble(bubble);
        }
      });
      ui.addBubble(bubble);
    }, false);

    markers.forEach(marker => {
      const html = `
        <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px;">${marker.title}</div>
        <div style="color: #4b5563; line-height: 1.4;">${marker.description}</div>
      `;
      addMarkerToGroup(group, { lat: marker.lat, lng: marker.lon }, html, marker.color, marker.title);
    });
  }

  // Add existing markers to the map
  addInfoBubble(map, ui, markers);

  // View switcher UI
  const viewSelect = document.createElement('select');
  viewSelect.innerHTML = `
    <option value="normal">Normal</option>
    <option value="satellite">Satellite</option>
    <option value="terrain">Terrain</option>
    <option value="night">Night</option>
  `;
  viewSelect.style.cssText = `
    position: absolute;
    bottom: 10px;
    left: 10px;
    z-index: 999;
    padding: 6px 10px;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid #ccc;
    background: white;
    font-family: sans-serif;
  `;
  document.body.appendChild(viewSelect);

  viewSelect.addEventListener('change', function () {
    const val = this.value;
    if (val === 'normal') map.setBaseLayer(defaultLayers.vector.normal.map);
    if (val === 'satellite') map.setBaseLayer(defaultLayers.raster.satellite.map);
    if (val === 'terrain') map.setBaseLayer(defaultLayers.raster.terrain.map);
    if (val === 'night') map.setBaseLayer(defaultLayers.vector.normal.night);
  });

  // Button to calculate route
  const calculateRouteButton = document.createElement('button');
  calculateRouteButton.innerText = 'Calculate Safest Route';
  calculateRouteButton.style.cssText = `
    position: absolute;
    bottom: 10px;
    left: 130px;
    z-index: 999;
    padding: 6px 12px;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid #ccc;
    background: #28a745;
    color: white;
    cursor: pointer;
    font-family: sans-serif;
  `;
  document.body.appendChild(calculateRouteButton);

  // Instruction text for user
  const instructionDiv = document.createElement('div');
  instructionDiv.innerText = 'Click map to set Start (1st click) and End (2nd click) points.';
  instructionDiv.style.cssText = `
    position: absolute;
    bottom: 50px;
    left: 10px;
    z-index: 999;
    padding: 6px 10px;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid #ccc;
    background: white;
    font-family: sans-serif;
  `;
  document.body.appendChild(instructionDiv);

  // Handle map clicks to set start and end points
  map.addEventListener('tap', (evt) => {
    const coord = map.screenToGeo(evt.currentPointer.viewportX, evt.currentPointer.viewportY);
    if (!startPoint) {
      // Set start point
      startPoint = coord;
      addMarkerToGroup(routeGroup, startPoint, '<div>Start Point</div>', '#28a745', 'Start');
      instructionDiv.innerText = 'Click map to set End point.';
    } else if (!endPoint) {
      // Set end point
      endPoint = coord;
      addMarkerToGroup(routeGroup, endPoint, '<div>End Point</div>', '#dc3545', 'End');
      instructionDiv.innerText = 'Click "Calculate Safest Route" button.';
      calculateRouteButton.disabled = false;
    }
  });

  // Function to check if a point is inside any crime bounding box
  function isPointInCrimeArea(point, crimeMarkers) {
    const radius = 100 / 111139; // 100 meters in degrees
    return crimeMarkers.some(marker => {
      const southWest = { lat: marker.lat - radius, lng: marker.lon - radius };
      const northEast = { lat: marker.lat + radius, lng: marker.lon + radius };
      return (
        point.lat >= southWest.lat &&
        point.lat <= northEast.lat &&
        point.lng >= southWest.lng &&
        point.lng <= northEast.lng
      );
    });
  }

  // Function to calculate the safest route and show crime area bounding circles
  function calculateSafestRoute() {
    if (!startPoint || !endPoint) {
      alert('Please set both start and end points.');
      return;
    }

    // Check if start or end points are in crime areas
    const crimeMarkers = markers.filter(marker => marker.title.toLowerCase() === 'crime');
    if (isPointInCrimeArea(startPoint, crimeMarkers) || isPointInCrimeArea(endPoint, crimeMarkers)) {
      instructionDiv.innerText = 'Start or End point is in a crime area. Please choose different points.';
      return;
    }

    // Clear previous route and crime areas
    routeGroup.removeAll();
    crimeAreaGroup.removeAll();

    // Re-add start and end markers
    addMarkerToGroup(routeGroup, startPoint, '<div>Start Point</div>', '#28a745', 'Start');
    addMarkerToGroup(routeGroup, endPoint, '<div>End Point</div>', '#dc3545', 'End');

    // Create avoid areas and add circular bounding boxes (100-meter radius)
    const avoidAreas = crimeMarkers.map(marker => {
      console.log(marker);
      // Create a circular area with 100-meter radius
      const circle = new H.map.Circle(
        new H.geo.Point(marker.lat, marker.lon), // Center
        100, // Radius in meters
        {
          style: {
            fillColor: 'rgba(255, 0, 0, 0.2)', // Semi-transparent red
            strokeColor: '#ff0000',
            lineWidth: 2
          }
        }
      );
      crimeAreaGroup.addObject(circle);

      // Calculate bounding box for the circle to use in avoidAreas
      const boundingBox = circle.getBoundingBox();
      const southWest = { lat: boundingBox.getBottom(), lng: boundingBox.getLeft() };
      const northEast = { lat: boundingBox.getTop(), lng: boundingBox.getRight() };

      // Return avoid area string for routing
      return `${southWest.lat},${southWest.lng};${northEast.lat},${northEast.lng}`;
    }).join('|');

    // Initialize routing service
    const router = platform.getRoutingService(null, 8);

    // Routing parameters with strict avoidance
    const routingParameters = {
      transportMode: 'pedestrian',
      origin: `${startPoint.lat},${startPoint.lng}`,
      destination: `${endPoint.lat},${endPoint.lng}`,
      return: 'polyline,summary',
      ...(avoidAreas && { avoidAreas: avoidAreas }), // Add avoid areas if present
      routeAttributes: ['avoidAreas'], // Ensure avoid areas are strictly respected
      alternatives: 0 // Disable alternative routes to prioritize strict avoidance
    };

    // Calculate route
    router.calculateRoute(routingParameters, (result) => {
      if (result.routes && result.routes.length > 0) {
        const route = result.routes[0];
        const routeShape = route.sections[0].polyline;

        // Convert polyline to geometry
        const linestring = H.geo.LineString.fromFlexiblePolyline(routeShape);
        const polyline = new H.map.Polyline(linestring, {
          style: { lineWidth: 4, strokeColor: '#28a745' }
        });

        // Add route to map
        routeGroup.addObject(polyline);

        // Zoom to route
        map.getViewModel().setLookAtData({
          bounds: polyline.getBoundingBox()
        });

        // Display route summary
        const summary = route.sections[0].summary;
        instructionDiv.innerText = `Route calculated: ${summary.length} meters, ~${Math.round(summary.travelTime / 60)} minutes`;
      } else {
        instructionDiv.innerText = 'No route found that avoids all crime areas. Try different points or adjust crime areas.';
      }
    }, (error) => {
      console.error('Routing error:', error);
      instructionDiv.innerText = 'Error calculating route. Crime areas may be unavoidable. Please try different points.';
    });
  }

  // Disable route button until both points are set
  calculateRouteButton.disabled = true;
  calculateRouteButton.addEventListener('click', calculateSafestRoute);

  // Reset functionality
  const resetButton = document.createElement('button');
  resetButton.innerText = 'Reset Points';
  resetButton.style.cssText = `
    position: absolute;
    bottom: 10px;
    left: 300px;
    z-index: 999;
    padding: 6px 12px;
    font-size: 14px;
    border-radius: 6px;
    border: 1px solid #ccc;
    background: #dc3545;
    color: white;
    cursor: pointer;
    font-family: sans-serif;
  `;
  document.body.appendChild(resetButton);

  resetButton.addEventListener('click', () => {
    startPoint = null;
    endPoint = null;
    routeGroup.removeAll();
    crimeAreaGroup.removeAll();
    instructionDiv.innerText = 'Click map to set Start (1st click) and End (2nd click) points.';
    calculateRouteButton.disabled = true;
  });

  map.addEventListener('mapviewchange', () => {
    map.getViewPort().setPadding(80, 80, 80, 80);
  }, { once: true });
})();