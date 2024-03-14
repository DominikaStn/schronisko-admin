import Layout from "@/components/Layout";
import PodopiecznyForm from "@/components/PodopiecznyForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EdytujStronePodopieczny() {
    const [podopiecznyInfo, setPodopiecznyInfo] = useState(null);
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
    return (
        <Layout>
            <h1>Edytuj informacje o zwierzaku</h1>
            {podopiecznyInfo && (
            <PodopiecznyForm {...podopiecznyInfo}/>
            )}
        </Layout>
    );
}