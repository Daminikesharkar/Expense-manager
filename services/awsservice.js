const AWS = require('aws-sdk');

exports.uploadToS3 = async (data, filename) =>{
    const bucketName = process.env.BUCKET_NAME;
    const iamUserKey = process.env.IAM_USER_KEY;
    const iamUserSecret = process.env.IAM_USER_SECRET;
  
    return new Promise((resolve,reject)=>{
        const s3bucket = new AWS.S3({
            accessKeyId: iamUserKey,
            secretAccessKey: iamUserSecret,
        });
    
        const params = {
            Bucket: bucketName,
            Key: filename,
            Body:data,
            ACL: 'public-read'
        }
    
        s3bucket.upload(params,(err,s3response)=>{
            if(err){
                console.log("Something went wrong",err);
                reject(err);
            }else{
                console.log('Success',s3response);
                resolve(s3response.Location);
            }
        });
    })   
  }