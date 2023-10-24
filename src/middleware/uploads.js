const multer  = require('multer')
const path  =  require("path")

const storage = multer.diskStorage({
    destination: function (req, file, callback) { 
      callback(null,  path.join(__dirname ,  '../my-uploads') );
    },
    filename: function (req, file, callback) {
      const uniquePrefix = Date.now() ;
      callback(null,  uniquePrefix +  '-' +  file.originalname  );
    }
  })

  const fileFilter = (req, file, cb)=> {
    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted
    if(file.mimetype == "image/jpeg"  ||  file.mimetype == "image/png"){
    // To reject this file pass `true`, like so:
    cb(null, true)
    }else{
        // To accept the file pass `false`, like so:
         cb(null, false)
    }

    // You can always pass an error if something goes wrong:
   // cb(new Error('I don\'t have a clue!'))
  
  }

const option = {
      storage,
      fileFilter,
      limits : { fileSize : 1024* 1024 * 5 , }
}

const upload = multer( option)

const fileUploads = (formkey, method)=>{
     
  return function (req, res, next){
     let uploadedItem
     if(method == "single"){
        uploadedItem = upload.single(formkey)
     }else if(method == "multiple"){
       uploadedItem = upload.any(formkey) 
     }
  

   return uploadedItem(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
        return res.status(500).send({message : err.message})
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(501).send({message : err.message})
    }

    // Everything went fine.
       return next();
    })
 };

}




module.exports =  fileUploads ;