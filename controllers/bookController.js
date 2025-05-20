// to add a  book
const books = require('../model/bookModel')

exports.addBookController = async(req,res) => {
    console.log('inside the add book controller')
    // console.log(req.body)
    console.log(req.files)

    const { title, author , isbn , noofpages, price , abstract , uploadedImg ,  dprice , imageUrl , publisher ,
        language, category , status , userMail , brought
     } = req.body ;

    console.log({title, author , isbn , noofpages, price , abstract , uploadedImg ,  dprice , imageUrl , publisher ,
        language, category , status , userMail , brought})

    const uploadedImage = []
    req.files.map( item => uploadedImage.push(item.filename) )
    console.log(uploadedImage)

    const email = req.payload
    console.log({email})

    try{
        const existingBook = await books.findOne({title, userMail:email })

        if (existingBook){
            res.status(400).json('Book Already Added to the Server');
        }else{
            const newBook = new books({
                title, author , isbn , noofpages, price , abstract , uploadedImg:uploadedImage  ,  dprice , imageUrl , publisher ,
                language, category , userMail:email
            })
            console.log('new book found',newBook);
            newBook.save();

            res.status(200).json(newBook);
        }
    }catch(error){
        res.status(500).json(error)
    }
    // res.status(200).json('request recived from add book controller')
}


// to get the latest books in the home page
exports.getHomeBookController = async(req,res) => {
    try{
        const allBooks = await books.find().sort({_id:-1}).limit(4)
        res.status(200).json(allBooks)
    }catch(error){
        res.status(500).json(error)
    }
}

// get all the books
exports.getAllBookController = async(req,res) => {
    const searchKey = req.query.search ;
    const email = req.payload
    try{

        const query = {
            title:{
                $regex: searchKey ,
                $options:"i" // to make it as lowercase
            },
            userMail: {
                $ne:email
            }
        }

        const allBooks = await books.find(query)
        res.status(200).json(allBooks)
    }catch(error){
        res.status(500).json(error)
    }
}

//to get a particular book from the database
exports.getSingleBookController  =  async(req,res) => {
    const {id} = req.params;
    console.log(id)
    try{
        const eBook = await books.findOne({_id: id});
        console.log(eBook)
        res.status(200).json(eBook)
    }catch(error){
        res.status(500).json(error)
    }
}



// ============================== ADMIN  ==============================

exports.getAllBookAdminController = async(req,res) => {
    try{
        const allExistingbooks = await books.find()
        res.status(200).json(allExistingbooks)
    }catch(error){
        res.status(500).json(error)
    }
}

exports.approveBookController = async(req,res) => {
    const { _id, title, author , isbn , noofpages, price , abstract , uploadedImg ,  dprice , imageUrl , publisher ,
        language, category , status , userMail , brought
     } = req.body ;
     console.log({ _id, title, author , isbn , noofpages, price , abstract , uploadedImg ,  dprice , imageUrl , publisher ,
        language, category , status , userMail , brought
     })

    try{
        const existingBook =  await books.findByIdAndUpdate({_id},{
        title, author , isbn , noofpages, price , abstract , uploadedImg ,  dprice , imageUrl , publisher ,
        language, category , status:'approved' , userMail , brought
         }
        );

        await existingBook.save()
        res.status(200).json(existingBook)

    }catch(error){
        res.status(500).json(error)
    }
}