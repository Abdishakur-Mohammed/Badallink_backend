
import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import Request from '../models/Requests.js'


const router = express.Router()


router.post('/', protectRoute, async (req, res) => {
    try {
        // Step 1: Get the data from the request body
        const { to, post } = req.body

        // Step 2: Check if a request already exists (no spam!)
        const existingRequest = await Request.findOne({ from: req.user._id, to, post })
        if (existingRequest) {
            return res.status(400).json({ message: 'Request already exists' })
        }

        // Step 3: Create and save the new request
        const request = new Request({ from: req.user._id, to, post })
        await request.save()

        // Step 4: Respond with the created request
        res.status(201).json(request)

    } catch (error) {
        console.error('Error creating request:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

router.get('/', protectRoute, async (req, res) => {
    try {
        const requests = await Request.find({ to: req.user._id })
            .populate('from', 'username profileImage')
            .populate('post', 'title description offering need')
        res.status(200).json(requests)

    } catch (error) {
        console.error('Error fetching requests:', error)
        res.status(500).json({ message: 'Server error' })
    }
})













export default router
