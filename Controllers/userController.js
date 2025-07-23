import prisma from "../DB/db_config.js";

import jwt from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET || JWT_SECRET

//create user
export const createUser = async (req, res) => {
    const { name, email, password } = req.body

    try {
        //find uniq email
        const findUserEmail = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (findUserEmail) {
            return res.json({
                status: 400,
                msg: "email already exist!! use different email."
            })
        }


        const user = await prisma.user.create({
            data: {
                name,
                email,
                password
            }
        })

        return res.json({ status: 200, data: user, msg: "user created" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//get all user 

export const getUser = async (req, res) => {
    try {
        const user = await prisma.user.findMany()

        return res.json({ status: 200, data: user, msg: "user Data" })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

//login user 
export const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body
        // console.log("email", email)

        if (!email && !password) {
            return res.status(400).json({ message: "User email and Password is required" });
        }

        const user = await prisma.user.findUnique({
            where: {
                email,
                password
            }
        })
        if (!user) {
            return res.status(400).json({ message: "User ID is required" });
        }
        // console.log("user", user)
        let id = user.id
        // Generate JWT token
        const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: "1h" });
        // console.log("token", token)
        return res.json({ status: 200, data: user, msg: "user fetch", token: token })
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}