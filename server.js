const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended:false}));
app.use(express.json());

// Connect to database
const db = new sqlite3.Database('./db/election.db', err => {
    if (err) {
        return console.error(err.message);
    }

    console.log('Connected to the election database.');
});

// GET all candidates from table
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT * FROM candidates`;
    const params = [];
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({error: err.massage});
            return;
        }

        res.json({
            message: 'success',
            data: rows
        });
    });
});

// GET a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT * FROM candidates
                 WHERE id = ?`;
    const params = [req.params.id];
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({error: err.massage});
            return;
        }
    
        res.json({
            message: 'success',
            data: row
        });
    });
});

// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.run(sql, params, function (err, result) {
        if (err) {
            res.status(400).json({error: res.message});
            return;
        }

        res.json({
            message: 'successfully deleted',
            changes: this.changes
        });
    });
});

// Create a candidate
// const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
//             VALUES (?, ?, ?,?)`;
// const params = [1, 'Ronald', 'Firbank', 1];
// // ES5 function, not arrow function, to use this
// db.run(sql, params, function (err,result) {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result, this.lastID);
// })

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