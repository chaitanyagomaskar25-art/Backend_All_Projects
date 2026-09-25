import { User } from "../models/userModel"

export const registerUser = async (req, res) => {
    try {
        const {name, email, password, role} = req.body
        if(!name || !email || !password || !role){
            return res.status(401).json({
                message: "User information is incomplete"
            })
        }

        const exist = await User.findOne({email})
        
    } catch (error) {
        
    }
}