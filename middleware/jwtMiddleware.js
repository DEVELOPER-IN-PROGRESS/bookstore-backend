const jwt = require('jsonwebtoken')

const jwtMiddleware = (req,res, next) => {
  console.log('inside the jwt middleware')
  console.log(req.headers)
  const token = req.headers.authorization.split(' ')[1]
  console.log(token)

  try{
    const jwtResponse = jwt.verify(token, process.env.JWT_SECRET)
    console.log(jwtResponse)
    req.payload = jwtResponse.email ;
    next();
  }catch(error){
    res.status(401).json(`Invalid token ${error}`)
  }

}

module.exports = jwtMiddleware;