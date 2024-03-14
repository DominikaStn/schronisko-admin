import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ZgloszeniaPage() {
    const [zgloszenia, setZgloszenia] = useState([]);
    useEffect(() => {
        axios.get('/api/zgloszenia').then(response => {
            setZgloszenia(response.data);
        });
    }, []);
    return(
        <Layout>
            <h1>Zagłoszenia</h1>
            <table className="basic">
                <thead>
                    <tr>
                        <th>Data zgłoszenia</th>
                        <th>Ochotnik</th>
                        <th>Podopieczni</th>
                    </tr>
                </thead>
                <tbody>
                    {zgloszenia.length > 0 && zgloszenia.map(zgloszenie =>(
                        <tr>
                            <td>{zgloszenie.createdAt.replace('T',' ').substring(0, 19)}</td>
                            <td>
                                {zgloszenie.name} {zgloszenie.email} <br />
                                {zgloszenie.streetAddress} {zgloszenie.postalCode} {zgloszenie.city} <br />
                                {zgloszenie.number}
                            </td>
                            <td>
                                {zgloszenie.line_items.map(l => (
                                    <>
                                    {l.info_animal?.animal_data.nazwa}<br />
                                    </>
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
}
