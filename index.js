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
        app.get('/tasks', async (req, res) => {
            const queryEmail = req.query.email;
            const query = { email: queryEmail }
            const result = await taskCollections.find(query).toArray()
            res.send(result)
        })
        app.patch('/task/complete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const options = { upsert: false };
            const updateDoc = {
                $set: {
                    completed: true,
                },
            };
            const result = await taskCollections.updateOne(query, updateDoc, options);
            res.send(result)
        })
        app.patch('/task/notcomplete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const options = { upsert: false };
            const updateDoc = {
                $set: {
                    completed: false,
                },
            };
            const result = await taskCollections.updateOne(query, updateDoc, options);
            res.send(result)
        })
        app.patch('/task/edit/:id', async (req, res) => {
            const id = req.params.id;
            const task = req.body;
            const query = { _id: ObjectId(id) }
            const options = { upsert: false };
            const updateDoc = {
                $set: {
                    title: task.title,
                    image: task.image,
                    description: task.description
                },
            };
            const result = await taskCollections.updateOne(query, updateDoc, options);
            res.send(result)
        })
        app.patch('/task/comment/:id', async (req, res) => {
            const id = req.params.id;
            const task = req.body;
            const query = { _id: ObjectId(id) }
            const options = { upsert: false };
            const updateDoc = {
                $set: {
                    comment: task.comment
                },
            };
            const result = await taskCollections.updateOne(query, updateDoc, options);
            res.send(result)
        })
        app.delete('/task/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await taskCollections.deleteOne(query);
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