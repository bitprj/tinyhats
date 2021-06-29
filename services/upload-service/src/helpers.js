import AWS from 'aws-sdk';
import generateUniqueId from 'generate-unique-id'
const ID = process.env.S3_ID;
const SECRET = process.env.S3_SECRET;
const BUCKET_NAME = 'uwuaascat';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

export async function uploadFile (fileName, fileContent, fileCategory) {
    let link = ""
    let key = `${fileCategory}/${fileName}`
    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: key, // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, (err, data) => {
        if (err) {
            throw err;
        }
        link = data.Location
        console.log(`File uploaded successfully. ${link}`);
    });
    return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`
};

export const fileExt = (ext) => {
    if (ext == "image/png") {
        return '.png'
    } else if (ext == "image/jpeg") {
        return '.jpeg'
    } else if (ext == "image/jpg") {
        return '.jpg'
    } else {
        process.exit()
    }
}

export const uniqueId = () => {
    const id = generateUniqueId({
        length: 16
    });

    return id
}