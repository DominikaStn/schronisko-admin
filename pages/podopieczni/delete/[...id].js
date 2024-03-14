import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteAnimalPage() {
    const [podopiecznyInfo, setPodopiecznyInfo] = useState();
    const router = useRouter();
    const{id} = router.query;
    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/podopieczni?id='+id).then(response => {
            setPodopiecznyInfo(response.data);
        });
    }, [id]);
    function goBack() {
        router.push('/podopieczni');
    }
    async function deletePodopieczny() {
        await axios.delete('/api/podopieczni?id='+id);
        goBack();
    }
    return (
        <Layout>
            <h1 className="text-center">Czy na pewno chcesz usunąć "{podopiecznyInfo?.nazwa}" ? </h1>
            <div className="flex gap-2 justify-center">
            <button className="btn-red" onClick={deletePodopieczny}>Tak</button>
            <button className="btn-default" onClick={goBack}>Nie</button>
            </div>
        </Layout>
    );
}
