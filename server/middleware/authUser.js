import jwt from 'jsonwebtoken'
const authUser = async(req, res, next) => {
    const {token} = req.cookies;

    if(!token){
        return res.json({success: false, message: 'Not Authorized'});
    }

    try{
        const toeknDecode = jwt.verify(token, process.env.JWT_SECRET)
        if(toeknDecode.id){
            req.body.userId = toeknDecode.id;
        }
        else{
            return res.json({success: false, message: 'Not Authorized'});
        }
        next();
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}
export default authUser