const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const analyzeImage = async (imagePath) => {
    try {
        const apiKey = 'acc_4c75aaa27a60afc'; // Replace with your Imagga API key
        const apiSecret = '45ed7ac78fb652a09b55c6837c4020ee'; // Replace with your Imagga API secret

        // Prepare the image file in a form-data format for Imagga
        const form = new FormData();
        form.append('image', fs.createReadStream(imagePath));

        // Send request to Imagga API for local image analysis
        const response = await axios.post(
            'https://api.imagga.com/v2/tags',
            form,
            {
                headers: {
                    ...form.getHeaders()
                },
                auth: {
                    username: apiKey,
                    password: apiSecret
                }
            }
        );

        // Extract tags from Imagga response
        const labels = response.data.result.tags.map(tag => tag.tag.en);
        const category = labels.length > 0 ? labels[0] : 'Uncategorized'; // Assign the first tag as the category
        const description = labels.join(', ');

        return {
            tags: labels || [],
            category: category,
            description: description || 'No description available'
        };

    } catch (error) {
        console.error('Error analyzing image:', error.message);
        return {
            tags: [],
            category: 'Uncategorized',
            description: 'No description available'
        };
    }
};

module.exports = { analyzeImage };
