import { Router } from "express";
import protectRoute from "../middleware/auth.middleware.js";
import Request from "../models/Requests.js";
import Message from "../models/Message.js";

const router = Router();


router.post('/', protectRoute, async (req, res) => {
    try {
        const sender = req.user._id;

        const { request, text } = req.body
        const existingRequest = await Request.findById(request)
        if (!existingRequest) {
            return res.status(404).json({ error: "Request not found" })
        }

        //status check
        if (existingRequest.status !== 'accepted') {
            return res.status(400).json({ error: "Request is not accepted" })
        }

        //receiver validation 
        if (existingRequest.from.toString() !== sender.toString() &&
            existingRequest.to.toString() !== sender.toString()) {
            return res.status(403).json({ error: "You are not authorized to send message to this request" })
        }

        const receiverId = existingRequest.from.toString() === sender.toString() ? existingRequest.to : existingRequest.from;

        const message = await Message.create({
            sender,
            receiver: receiverId,
            request,
            text
        })
        res.status(201).json(message)
    } catch (error) {
        console.log("Error in sendMessage controller:", error)
        res.status(500).json({ error: "Internal server error" })
    }
})

router.get("/:requestId", protectRoute, async (req, res) => {
    try {
        const sender = req.user._id
        const { requestId } = req.params
        const existingRequest = await Request.findById(requestId)
        if (!existingRequest) {
            return res.status(404).json({ error: "Request not found" })
        }
        //status check
        if (existingRequest.status !== 'accepted') {
            return res.status(400).json({ error: "Request is not accepted" })
        }
        //receiver validation 
        if (existingRequest.from.toString() !== sender.toString() &&
            existingRequest.to.toString() !== sender.toString()) {
            return res.status(403).json({ error: "You are not authorized to send message to this request" })
        }

        const message = await Message.find({ request: requestId })
        res.status(200).json(message)
    } catch (error) {
        console.log("Error in getMessages controller:", error)
        res.status(500).json({ error: "Internal server error" })
    }
})

export default router;