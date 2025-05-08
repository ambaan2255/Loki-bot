const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");


const uploadToCatbox = async (media, filename, contentType) => {
    try {
        const formData = new FormData();
        formData.append("reqtype", "fileupload");
        formData.append("fileToUpload", media, {
            filename,
            contentType,
        });

        const response = await axios.post("https://catbox.moe/user/api.php", formData, {
            headers: formData.getHeaders(),
        });
        
        return response.data.trim();
    } catch (error) {
        throw new Error("Failed to upload to Catbox: " + error.message);
    }
};

module.exports = {
    uploadToCatbox
};
