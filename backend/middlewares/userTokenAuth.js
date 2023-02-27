const jwt = require('jsonwebtoken');

// this middleware is used to check for (user token) authorization to verify 
// that the action made by a logged in user.
// (Add Place, Delete , Edit) actions must send the token with request headers
// check axios requests in (placeItem.js, editPlace.js, addPlace.js) pages.

module.exports = (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1];    // Authorization: 'bearer token',
    
    // (options) is a request sent before evry request (browser default)
    // we need to let this request continue its journey
    if(req.method == "OPTIONS")
    return next()
    
    // if the request made by the user has no token in its headers 
    if(!token)
    return res.status(401).json({message: 'Unauthorized User Access, Missing User Token!'})

    // if token exist in request headers
    try{
        let decodedToken = jwt.verify(token, 'secret_key_must_not_tell');
        // this userAuthData wil be used in verifying if the logged in user
        // is also the creator of the place when (update, delete).
        req.userAuthData = {userID: decodedToken.userID}
        // console.log(decodedToken)
        next()
    }
    catch(err){
        return res.status(500).json({message: 'User Token Authintecation Failed!, Please Try Later', err: err})
    }
}