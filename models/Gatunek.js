import mongoose, { Schema, model, models } from "mongoose";

const GatunekSchema = new Schema({
    nazwa: {type: String, required:true},
    nowy: {type: mongoose.Types.ObjectId, ref:'Gatunek'},
    cechy: [{type:Object}]
});

export const Gatunek = models?.Gatunek || model('Gatunek', GatunekSchema);