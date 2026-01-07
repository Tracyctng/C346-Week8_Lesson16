// include the required packages
const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

// database config info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

// initialize Express app
const app = express();
// helps app to read JSON
app.use(express.json());

// start the server
app.listen(port, () => {
    console.log('Server started on port', port);
});

// get all rides
app.get('/allrides', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM defaultdb.amusement_park');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error for allrides'});
    }
});

// add a new ride
app.post('/addride', async (req, res) => {
    const { ride_name, ride_image } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO amusement_park (ride_name, ride_image) VALUES (?, ?)', [ride_name, ride_image]);
        res.status(201).json({message: 'Ride '+ride_name+' added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not add ride '+ride_name });
    }
});

// update the list of rides
app.put('/updateride/:id', async (req, res) => {
    const { id } = req.params;
    const { ride_name, ride_image } = req.body;

    try {
        let connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE amusement_park SET ride_name = ?, ride_image = ? WHERE id = ?',
            [ride_name, ride_image, id]
        );
        res.json({ message: `Ride ${id} updated successfully` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not update ride' });
    }
});

// delete an existing ride
app.delete('/deleteride/:id', async (req, res) => {
    const { id } = req.params;

    try {
        let connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'DELETE FROM amusement_park WHERE id = ?',
            [id]
        );
        res.json({message: `Ride ${id} deleted successfully`});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not delete ride' });
    }
});