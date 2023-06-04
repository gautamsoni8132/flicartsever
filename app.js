const express = require('express');
const app = express();
const SellerRegistration = require('./db/model/schema');
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

app.use(express.json({ limit: '50mb' }));
app.use(express(express.urlencoded({ extended: false })));
app.use(cors());

require('./db/conn');

app.get("/", (req, res) => {
    res.send("Helllo From Server!")
})

app.post('/login', async (req, res) => {
    try {
        const { token } = req.body;
        // console.log(`Login.... ${token}`)
        if (!token) {
            const { email, password } = req.body;
            if (!email || !password) { return res.status(400).json({ error: `Fill All the data` }) }
            const getData = await SellerRegistration.findOne({ email: email });
            if(!getData){return res.status(400).json({error:`Invailid Data`})}
            if (getData.password != password) { console.log(`Invailid Login Detail`); return res.status(400).json({ error: `I don't Know.` }) }
            const jwttoken = await getData.createJwt();
            console.log(`Login`);
            res.status(200).json({ jwttoken });
        } else {
            const id = await jwt.verify(token, process.env.KEY);
            const _id = id._id;
            const getSellerData = await SellerRegistration.findOne({ _id });
            console.log('Login check')
            if(!getSellerData){return res.status(400).json({message :`User Not Found`})}
           
            res.status(200).json(getSellerData);
        }

    } catch (error) {
        console.log(`error: ${error}`);
        res.status(400).json({ Error: "Not Login" });
    }
});

app.post('/logout', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) { return res.status(400).json({ Error: "Not Login" }); }
        const id = await jwt.verify(token, process.env.KEY);
        const _id = id._id;
        const getSellerData = await SellerRegistration.findOne({ _id });
        const result = await getSellerData.clearjwt(_id);
        if (result) {
            console.log(`Clear JWT Successfully....`)
        }
        res.status(200).json({ message: "Logout" });

    } catch (error) {
        console.log(`Error: ${error}`)
    }
})

app.post("/sellerRegistration", async (req, res) => {

    try {
        const { name, mobileSet, email, gst, password, cpassword, displayName, pincode, add1, add2, add3, city, state } = req.body;
        if(password != cpassword){return res.status(400).json({ error: `Password Not Macth` })}
        const sellerCheck = await SellerRegistration.findOne({email});
        const sellerCheck2 = await SellerRegistration.findOne({mobileSet});
        if(sellerCheck){
            if(sellerCheck.mobileSet == mobileSet || sellerCheck.email == email){return res.status(300).json({})}
        }
        if(sellerCheck2){
            if(sellerCheck2.mobileSet == mobileSet || sellerCheck2.email == email){return res.status(300).json({})}
        }
        const sellerData = new SellerRegistration({
            name, mobileSet, email, gst, password, cpassword, displayName, pincode, add1, add2, add3, city, state
        })
        const result = await sellerData.save();
        if (!result) { console.log(`Not Insert Data`); return res.status(400).json({ error: `Not Register` }) }
        console.log(`Insert seller Data`);
        const token = await sellerData.createJwt();
        res.status(200).json({ token });

    } catch (err) {
        console.log(`error: ${err}`);
        return res.status(400).json({ error: `Not Register` })
    }
})

app.post("/onboarding", async (req, res) => {
    try {
        const { email, name, displayName, pincode, add1, add2, add3, city, state } = req.body;
        if (!email || !name || !displayName || !pincode || !add1 || !add2 || !add3 || !city || !state) { return res.status(400).json({ error: `All Data Not Insert.` }) }

        const sellerData = await SellerRegistration.findOne({ email });
        if (!sellerData) { return res.status(400).json({ error: `Seller Not Found.` }) }
        const result = await sellerData.allDataInsert(name, displayName, pincode, add1, add2, add3, city, state);
        if (result) {
            res.status(200).json({ error: `Inster Onbording Data` })
        } else {
            res.status(400).json({ error: `Not Inster Onbording Data` })
        }
        // res.status(200).json({ message: `On boarding Data insert` });

    } catch (error) {
        console.log(`Error: ${error}`)
        res.status(400).json({ error: `Not Inster Onbording Data` })
    }
})

app.listen(PORT, (err) => {
    console.log(`Server is Active on ${PORT}`)
})