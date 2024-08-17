import jwt from "jsonwebtoken"

const jwtAuth = (req,res,next)=>{
    //1.Read the token
    const token = req.headers["authorization"]

    //2.if no token, return the error
    if(!token){
        return res.status(401).send("Unauthorized")
    }
    //3.check if the token is valid
    try{
        const payload = jwt.verify(token,"GWEIFqBQgyLpkMRa0U4pgsoXU5Hs3QST")
        req.userID=payload.userId
        console.log(payload)
    }
    catch(err){
        //4.return error
        return res.status(401).send("Unauthorized")
    }
    //5.call next middleware
    next()
}

export default jwtAuth