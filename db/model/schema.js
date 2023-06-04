const mongoose = require('mongoose');
require('../conn');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const sellerRegistration = new mongoose.Schema({
        name: { type: String },
        mobileSet: { type: Number, required: true },
        email: { type: String, required: true },
        gst: { type: String },
        pan: { type: String },
        password: { type: String, required: true },
        cpassword: { type: String, required: true },
        displayName: { type: String },
        pincode: { type: String },
        add1: { type: String },
        add2: { type: String },
        add3: { type: String },
        city: { type: String },
        state: { type: String },
        tokens: [{
                token: { type: String }
        }]
});

sellerRegistration.methods.createJwt = async function () {
        const token = await jwt.sign({ _id: this._id }, process.env.KEY);
        this.tokens = this.tokens.concat({ token: token });
        this.save();
        return token;
}

sellerRegistration.methods.clearjwt = async function (_id) {
        try {
                this.tokens = [];
                this.save();
                return true;
        } catch (error) {
                console.log(`Jwt Not Clear`)
        }
}

sellerRegistration.methods.allDataInsert = async function (name, displayName, pincode, add1, add2, add3, city, state) {
        try {
                this.name = name;
                this.displayName = displayName;
                this.pincode = pincode;
                this.add1 = add1;
                this.add2 = add2;
                this.add3 = add3;
                this.city = city;
                this.state = state;

                this.save();
                return true;
        } catch (error) {
                console.log(`All Data Not Insert.`);
                return false;
        }
}


const SellerRegistration = new mongoose.model("SellerRegistration", sellerRegistration);

module.exports = SellerRegistration;
