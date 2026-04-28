import express from 'express'
import protectRoute from '../middleware/auth.middleware.js'
import Request from '../models/Requests.js'

const router = express.Router()

router.post('/', protectRoute, async (req, res) => {
    try {
        const { to, post } = req.body // ✅ Fixed (Defined before use)

        const existingRequest = await Request.findOne({ from: req.user._id, to, post })
        if (existingRequest) {
            return res.status(400).json({ message: 'Request already exists' })
        }

        const request = new Request({ from: req.user._id, to, post })
        await request.save()
        res.status(201).json(request)
    } catch (error) {
        console.error('Error creating request:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

router.get('/', protectRoute, async (req, res) => {
    try {
        const requests = await Request.find({
            $or: [{ to: req.user._id }, { from: req.user._id }]
        })
            .populate('from', 'username profileImage')
            .populate('post', 'title description offering need')
        res.status(200).json(requests)
    } catch (error) {
        console.error('Error fetching requests:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

// ✅ Put this back so your Inbox buttons work!
router.patch('/:id', protectRoute, async (req, res) => {
    try {
        const { status } = req.body
        const request = await Request.findById(req.params.id)

        if (!request) {
            return res.status(404).json({ message: 'Request not found' })
        }

        if (request.to.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Forbidden' })
        }

        request.status = status
        await request.save()
        res.status(200).json(request)
    } catch (error) {
        console.error('Error updating request:', error)
        res.status(500).json({ message: 'Server error' })
    }
})

export default router
