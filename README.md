Method 1: Use Live Server Extension (Recommended)
    1.Install Live Server
        Open VS Code Extensions (Ctrl+Shift+X)
        Search for "Live Server" by Ritwick Dey
        Install it
        
    2.Run the Server
        Right-click your HTML file
        Select "Open with Live Server"
        A browser tab will open at http://localhost:5500

Method 2: Use Node.js + Express (Manual Setup)

    1.Create a server.js file:
        const express = require('express');
        const app = express();
        const port = 3000;
  
        // Serve static files
        app.use(express.static('.'));
          
        app.listen(port, () => {
          console.log(`Server running at http://localhost:${port}`);
        });

    2.Install Express:
      
        npm init -y
        npm install express

    3.Start the server:

        node server.js

    4.Open http://localhost:3000 in your browser.

Method 3: Python Simple HTTP Server

    1.Open a terminal in VS Code (Ctrl+`)
    2.Navigate to your project directory
    3.Run:
        python -m http.server 8000
        (Python 3.x required)
    4.Open http://localhost:8000 in your browser.
