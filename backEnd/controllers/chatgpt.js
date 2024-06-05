const axios = require("axios")

const chat = async (req, res) => {
    const userMessage = req.body.userMessage;
    console.log(req.body);

    // Debugging: Print the user message to ensure it's not null
    console.log('User Message:', userMessage);

    if (!userMessage || userMessage.trim() === "") {
        return res.status(400).send({ error: "Message content cannot be empty." });
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage.trim() }],
            max_tokens: 50,
            temperature: 0.7,
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        const botMessage = response.data.choices[0].message.content.trim();
        res.json({ message: botMessage });
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).send('Something went wrong');
    }
}

module.exports = {chat}
