const users = require('../model/userModel');
const jwt = require('jsonwebtoken')

exports.registerController =  async (req,res) => {
	//logic
  	const { username, email , password }  = req.body ;
	console.log(req.body)

	try{
	  const existingUser = await users.findOne({ email:email } );

	  if(existingUser){
	    res.status(409).json('User Already Exists!');
	  }else{
	     const  newUser = new users({
		username,
		email,
		password,
	     });

 	 // save() is a mongoose method
        await  newUser.save()
	    res.status(200).json(newUser);
 	  }
	}catch(err){
	 	res.status(500).json(err);
	}
	//res.status(200).json('request received')
}

// normal login controller
exports.loginController = async(req,res) => {
	const { email ,password } = req.body;
	console.log(email,password)
	try{
		const existingUser = await users.findOne({email});

		if(existingUser){
			if(existingUser.password == password){
				const token = jwt.sign({ email:existingUser.email}, process.env.JWT_SECRET )
				console.log(token)
				res.status(200).json({existingUser,token})
			}else{
				res.status(401).json('invalid credentials')
			}
		}
		else{
			res.status(404).json('User Not Registered')
		}
	}catch(error){
		res.status(501).json(error)
	}
}

//google login controller
exports.googleLoginController = async(req,res) => {
	const {username , email , password , photo } = req.body;
	console.log(username, email , password , photo )

	try{
		const existingUser = await users.findOne({email})
		//check whether the user already has an account
		if(existingUser){
			console.log('User already Exists')
			const token = jwt.sign({ userMail:existingUser.email},process.env.JWT_SECRET)
			res.status(200).json({existingUser,token})
		}else{
			const newUser = new users({
				username,
				email,
				password,
				profile:photo
			})
			await newUser.save();
			const token = jwt.sign({ email:newUser.email },process.env.JWT_SECRET)
			res.status(200).json({newUser,token})
		}
	}catch(error){
		res.status(500).json(error)
	}
}

// get all users
exports.getAllUsersController = async(req,res) => {
	const emailadmin = req.payload
	console.log('hello there')
	console.log(emailadmin)
	try{
		const allUsers = await users.find({email:{$ne:emailadmin}})
		console.log(allUsers)
		res.status(200).json(allUsers)
	}catch(error){
		res.status(500).json(error)
	}
}

exports.editAdminProfileController = async(req,res) => {
	console.log('edit profile controller ')
	const { username , password , profile } = req.body;
	console.log(req.body)

	const prof = req.file? req.file.filename: profile
	console.log(prof)

	const email = req.payload
	console.log(email)
	try{
		const adminDetails = await users.findOneAndUpdate({email},
			{username , email , password , profile:prof},{new: true})
		await adminDetails.save()
			res.status(200).json(adminDetails)

	}catch(error){
		res.status(500).json(error)
	}
}

exports.editUserProfileController = async(req, res) => {
	console.log('user profile controller ')
	const { username , password , profile , bio  } = req.body;
	console.log(req.body);
	const email = req.payload
	const newBio = bio? req.body.bio : bio;
	const picture = req.file? req.file.filename: profile;

	console.log(newBio, picture,email)

	try{
		const userDetails = await users.findOneAndUpdate({email},{
		username, email , password , bio:newBio , profile: picture},
			{new:true})
		await userDetails.save()
		console.log(userDetails)
		res.status(200).json(userDetails)
	}catch(error){
		res.status(500).json(error)
	}
}