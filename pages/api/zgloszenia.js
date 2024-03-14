import { mongooseConnect } from "@/lib/mongoose";
import { Zgloszenie } from "@/models/Zgloszenie";

export default async function handler(req,res) {
    await mongooseConnect();
    res.json(await Zgloszenie.find().sort({createdAt: -1}));
}