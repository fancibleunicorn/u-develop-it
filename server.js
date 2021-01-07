const express = require('express');
const db = require('./db/database');


const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended:false}));
app.use(express.json());

// Use apiRoutes
const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

// Default response for any other requests(Not Found) Catch all *HAS TO BE LAST ROUTE*
app.use((req, res) => {
    res.status(404).end();
});

// Start server after DB connection
db.on('open', () => {
    // Function to start the Express.js server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})