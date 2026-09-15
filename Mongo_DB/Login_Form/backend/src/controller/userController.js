import { User } from "../model/userModel.js"

export const createUser = async (req, res) => {
    try {
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        res.status(201).json({
            status: "success",
            data: user
        })
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
}

export const getAllUers = async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json({
             status: "success",
            data: users
        })
    } catch (error) {
        res.status(500).json({
            status: "failed",
            message: error.message
        })
    }
}


