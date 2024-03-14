import { mongooseConnect } from "@/lib/mongoose";
import { Podopieczny } from "@/models/Podopieczny";
import { isAdminRequest } from "./auth/[...nextauth]";


export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();
    await isAdminRequest(req,res);


    if (method === 'GET') {
        if (req.query?.id) {
            res.json(await Podopieczny.findOne({_id:req.query.id}));
        } else {
            res.json(await Podopieczny.find());
        }
    }

    if (method === 'POST') {
        const {nazwa,opis,miesiace,zdjecia,gatunek, cechy} = req.body;
        const podopiecznyDoc = await Podopieczny.create({
            nazwa,opis,miesiace,zdjecia,gatunek,cechy,
        })
        res.json(podopiecznyDoc);
    }
    if (method === 'PUT') {
        const {nazwa,opis,miesiace,zdjecia,gatunek,cechy, _id} = req.body;
        await Podopieczny.updateOne({_id}, {nazwa,opis,miesiace,zdjecia,gatunek, cechy});
        res.json(true);
    }

    if (method === 'DELETE') {
        if (req.query?.id) {
            await Podopieczny.deleteOne({_id:req.query?.id});
            res.json(true);
        }
    }
}
