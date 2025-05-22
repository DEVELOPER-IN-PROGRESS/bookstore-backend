const jobs = require("../model/jobModel");

exports.addJobsContoller = async(req,res) => {
    const { title,location , jobType ,salary , qualification, experience , description } = req.body;
    // console.log({title,location , jobType ,salary , qualification, experience , description })

    try{
        const existingJobs = await jobs.findOne({title,location});
        console.log({existingJobs})
        if(existingJobs){
            res.status(400).json("job already added")
        }else{
            const newJob = await jobs({
                title,location , jobType ,salary , qualification, experience , description
            })
            console.log({newJob})
            await newJob.save()
            res.status(200).json(newJob)
        }

    }catch(error){
        res.status(500).json(error)
    }
}

exports.getAllJobsController = async(req,res) => {
const serachKey = req.query.search
console.log(serachKey)

 try{
    const options = {
        title:{$regex:serachKey, $options:'i'}
    }
    const allJobs = await jobs.find(options)
    console.log(allJobs)
    res.status(200).json(allJobs)

 }catch(error){
    res.status(500).json(error)
 }
}


//delete a job from the backend
exports.deleteAJobController  = async(req,res)=>{
    const {id} = req.params
    try{
        const job = await jobs.findByIdAndDelete({_id:id})
        res.status(200).json(job)
    }catch(error){
        res.status(500).json(error)
    }
}

/*


*/