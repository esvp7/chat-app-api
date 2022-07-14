//IMPORTS
const express = require('express');
const cors = require('cors');

const authRoutes = require("./routes/auth.js");

const app = express();
const PORT = process.env.PORT || 5000;

const accountSid = "ACc471f38bcfc83524a98712550e75ce6e";
const authToken = "ddda6130efe6175371c7b94741844c54";
const messagingServiceSid = "MGa8a7228be80ea4d7025264c78fa98d99";
const twilioClient = require('twilio')(accountSid, authToken);

//MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ROUTES
app.get('/', (req, res) => {
    res.send('Hello ur mom');
});

app.post('/', (req, res) => {
    const { message, user: sender, type, members } = req.body;

    if(type === 'message.new') {
        members
            .filter((member) => member.user_id !== sender.id)
            .forEach(({ user }) => {
                if(!user.online) {
                    twilioClient.messages.create({
                        body: `You have a new message from ${message.user.fullName} - ${message.text}`,
                        messagingServiceSid: messagingServiceSid,
                        to: user.phoneNumber
                    })
                        .then(() => console.log('Message sent!'))
                        .catch((err) => console.log(err));
                }
            })

            return res.status(200).send('Message sent!');
    }

    return res.status(200).send('Not a new message request');
});

app.use('/auth', authRoutes);

//PORT LISTEN
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));