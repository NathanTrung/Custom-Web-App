const fetch = require("node-fetch");

const HF_API_URL = "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest";
const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

async function queryHuggingFace(data) {
    try {
        const response = await fetch(HF_API_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(`Error: ${response.status} - ${errorDetails.error || "Unknown error"}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error querying Hugging Face API:", error.message);
        throw error;
    }
}

module.exports = { queryHuggingFace };
