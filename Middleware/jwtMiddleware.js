// import jwt from 'jsonwebtoken'

// const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET"

// export const verifyJWT = (req, res, next) => {
//     const token = req.header("Authorization");
//     if (!token) {
//         return res.status(400).json({ msg: "Access denied . No token provided" })
//     }

//     try {
//         const decode = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET)
//         req.user = decode
//         next()
//     } catch (error) {
//         res.status(401).json({ msg: "Invalid or expired token" })
//     }
// }

import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "JWT_SECRET"

export const verifyJWT = (req, res, next) => {
    const token = req.header("Authorization")

    if (!token) {
        req.status(400).json({ msg: "Access denied" })
    }

    try {
        const decode = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET)
        req.user = decode
        next()
    } catch (error) {
        res.status(400).json({ msg: "Invalid or expires token" })

    }
}