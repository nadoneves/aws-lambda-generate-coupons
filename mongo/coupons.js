const mongoose = require('mongoose');
mongoose.connect(process.env.STRING_MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 300000,
    keepAlive: true
});

const { Schema, model } = mongoose;

const CouponsSchema = new Schema({
    lot_id: {
        type: String,
        required: true
    },
    coupon: {
        type: String,
        required: true
    },
    used: {
        type: Boolean,
        required: true
    },
    usedAt: {
        type: Date,
        required: false
    }
}, 
{
    timestamps: true
});

const apiDB = mongoose.connection.useDb('coupon-manager');
const Coupons = apiDB.model('Coupons', CouponsSchema, 'coupons');

module.exports = {

    save: (data) => {
        return new Promise( (resolve, reject) => {
            Coupons.insertMany(data, (err, r) =>{
                if(err) {
                    console.log(err);
                    reject(err);
                }
                resolve(r);
            });
        });
    },

}
