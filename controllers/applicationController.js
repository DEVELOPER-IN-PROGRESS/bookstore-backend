const applications = require('../model/applicationModel')

exports.addApplications = async(req,res) => {

    const { fullname , jobtitle ,coverletter , qualification, phone, email  } = req.body;
    console.log(fullname , jobtitle ,coverletter , qualification, phone, email)

    const resume = req.file.filename
    console.log(resume)

    try{
        const existingApplication = await  applications.findOne({jobtitle,email})
        console.log(existingApplication)
        if(existingApplication){
            res.status(400).json('User Already applied for this job')
        }else{
            const newApplication = new applications({fullname, jobtitle ,
                coverletter , qualification, phone, email, resume})
            await newApplication.save()
            res.status(200).json(newApplication)
        }

    }catch(error){
        res.status(500).json(error)
    }
}