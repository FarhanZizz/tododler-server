const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

// MiddleWare
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.d0hszsm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const taskCollections = client.db('tododler').collection('tasks')

        app.post('/addtask', async (req, res) => {
            const task = req.body;
            const result = await taskCollections.insertOne(task);
            res.send(result)
        })


    }
    finally { }
}

run().catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('server running');
});

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})