import { mongooseConnect } from "@/lib/mongoose";
import {Gatunek} from "@/models/Gatunek";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req,res);

    if (method === 'GET') {
        res.json(await Gatunek.find().populate('nowy'));
    }

    if (method === 'POST') {
        const {nazwa, nowyGatunek, cechy} = req.body;
        const gatunekDoc = await Gatunek.create({nazwa, cechy, nowy:nowyGatunek || undefined,});
        res.json(gatunekDoc);
    }
    if (method === 'PUT') {
        const {nazwa, nowyGatunek, cechy, _id} = req.body;
        const gatunekDoc = await Gatunek.updateOne({_id},{nazwa,cechy, nowy:nowyGatunek || undefined,});
        res.json(gatunekDoc);
    }

    if (method === 'DELETE') {
        const {_id} = req.query;
        await Gatunek.deleteOne({_id});
        res.json('ok');
    }
}

