// to add a  book
const books = require('../model/bookModel')
const stripe = require('stripe')(process.env.STRIPE_SECRET)

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
    const searchKey = req.query.search;
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
        // console.log(eBook)
        res.status(200).json(eBook)
    }catch(error){
        res.status(500).json(error)
    }
}

exports.getAllUserBookController = async(req,res) => {
    const email = req.payload
    console.log({email})
    try{
        const allUserBroughtBooks = await books.find({userMail:email})
        res.status(200).json(allUserBroughtBooks)
    }catch(error){
        res.status(500).json(error)
    }
}

exports.getAllUserBroughtBookController = async(req,res) => {
     const email = req.payload
    console.log({email},'brought')
    try {
        const allBooksBoughtByUser = await books.find({brought : email})
        res.status(200).json(allBooksBoughtByUser)
    } catch (error) {
        res.status(500).json(error)
    }
}

//to get all books added by user
// exports.getAllUserAddedBooksController = async (req,res) => {
//     const email = req.payload
//     try {
//         const allBooksByUser = await books.find({userMail : email})
//         res.status(200).json(allBooksByUser)
//     } catch (error) {
//         res.status(500).json(error)

//     }
// }

//to get all books bought by user
// exports.getAllUserBoughtBookController = async (req,res) => {
//     const email = req.payload
//     try {
//         const allBooksBoughtByUser = await books.find({bought : email})
//         res.status(200).json(allBooksBoughtByUser)
//     } catch (error) {
//         res.status(500).json(error)

//     }
// }

exports.deleteUserBookController = async(req,res) => {
    const {id} = req.params
    console.log(id)
    try{
        await books.findOne({id})

        // await books.findByIdAndDelete({id})
        res.status(200).json('delete successful')
    }catch(error){
        res.status(500).json(error)
    }
}

// api to make the payment
exports.makePaymentController = async(req,res)=>{
   console.log('payment controller')
   const { bookDetails } = req.body;
   console.log({bookDetails})
   const email = req.payload;
   console.log(email);
   
   try{
     const existingBook = await books.findByIdAndUpdate({_id:bookDetails._id},{
         title : bookDetails.title  ,
            author : bookDetails.author  ,
            isbn  : bookDetails.isbn  ,
            noofpages : bookDetails.noofpages  ,
            price  : bookDetails.price  ,
            abstract  : bookDetails.abstract  ,
            uploadedImg  : bookDetails  ,
            dprice  : bookDetails.dprice  ,
            imageUrl  : bookDetails.imageUrl  ,
            publisher  : bookDetails.publisher  ,
            language: bookDetails.language,
            category: bookDetails.category,
            status: 'sold',
            userMail: bookDetails.userMail,
            brought: email
     },{new:true})
    //  debugger;
     console.log({existingBook})

    const line_item = [{
        price_data:{
            currency: "usd",
            product_data: {
                name: bookDetails.title,
                description: `${bookDetails.author} | ${bookDetails.publisher }`,
                images: [bookDetails.imageUrl],
                metadata:{
                    title : bookDetails.title  ,
                    author : bookDetails.author  ,
                    isbn  : bookDetails.isbn  ,
                    noofpages : bookDetails.noofpages  ,
                    price  : `${bookDetails.price}`  ,
                    abstract  : bookDetails.abstract.slice(0,200)  ,
                    // uploadedImg  : bookDetails  ,
                    dprice  : `${bookDetails.dprice}`  ,
                    imageUrl  : bookDetails.imageUrl  ,
                    publisher  : bookDetails.publisher  ,
                    language: bookDetails.language,
                    category: bookDetails.category,
                    status: 'sold',
                    userMail: bookDetails.userMail,
                    brought: bookDetails.brought,
                }
            },
            //cents to dollar conversion unit_amount is in cents.
            unit_amount: bookDetails.dprice*100,
        },
        quantity:1,
    }]
    // create stripe checkout session
     const session = await stripe.checkout.sessions.create({
        line_items: line_item,
        payment_method_types: ['card'],
        // change the success and failure urls later
        success_url:'http://localhost:5173/payment-success',
        cancel_url: 'http://localhost:5173/payment-error',
        mode: 'payment',
     })

    console.log({session})
    res.status(200).json({ sessionId:session.id, existingBook })

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