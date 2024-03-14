import mongoose, { Schema, model, models } from "mongoose";

const PodopiecznySchema = new Schema({
nazwa: {type: String, required: true},
opis: String,
miesiace: {type: Number, required: true},
zdjecia: [{type: String}],
gatunek: {type:mongoose.Types.ObjectId, ref:'Gatunek'},
cechy: {type: Object},
}, {
 timestamps: true,
});

export const Podopieczny = models.Podopieczny || model('Podopieczny', PodopiecznySchema);