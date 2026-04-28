import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import job from './src/config/cron.js';

import { connectDB } from './src/config/db.js'
import authRoutes from './src/routes/authRoutes.js'
import postRoutes from './src/routes/postRoutes.js'
import requestRoutes from './src/routes/requestRoutes.js'
import messageRoutes from './src/routes/messageRoutes.js'


dotenv.config()


const app = express()
const PORT = process.env.PORT || 8000
job.start()

app.use(cors())
app.use(express.json())


app.use('/api/users', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/requests', requestRoutes)
app.use('/api/messages', messageRoutes)

app.get("/", (req, res) => {
    res.json({ message: "Badallink API is live! 🚀", status: "Healthy" });
});

app.listen(PORT, () => {
    console.log(`The app is running on port ${PORT}`,
        connectDB()
    )
})