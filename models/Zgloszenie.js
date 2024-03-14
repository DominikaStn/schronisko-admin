const { Schema, model, models } = require("mongoose")


const ZgloszenieSchema = new Schema({
line_items:Object,
name:String,
email:String,
streetAddress:String,
postalCode:String,
city:String,
number:String,
done:Boolean,

}, {
    timestamps: true,
});

export const Zgloszenie = models?.Zgloszenie || model('Zgloszenie',ZgloszenieSchema);