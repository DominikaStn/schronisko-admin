import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function PodopiecznyForm({
    _id,
    nazwa:obecnaNazwa,
    opis:obecnyOpis,
    miesiace:obecneMiesiace,
    zdjecia:obecneZdjecia,
    gatunek:wybranyGatunek,
    cechy:wybraneCechy,
})
{
    const [nazwa, setNazwa] = useState(obecnaNazwa || '');
    const [opis, setOpis] = useState(obecnyOpis || '');
    const [gatunek, setGatunek] = useState(wybranyGatunek || '');
    const [podopiecznyCechy, setPodopiecznyCechy] = useState(wybraneCechy || {});
    const [miesiace, setMiesiace] = useState(obecneMiesiace || '');
    const [zdjecia, setZdjecia] = useState(obecneZdjecia || []);
    const [powrotPodopieczni, setPowrotPodopieczni] = useState(false);
    const[isUploading, setIsUploding] = useState(false);
    const[gatunki, setGatunki] = useState([]);
    const router = useRouter();
    useEffect(() => {
        axios.get('/api/gatunki').then(result => {
            setGatunki(result.data);
        })
    }, []);

    async function zapiszPodopieczny(ev) {
        ev.preventDefault();
        const data = {nazwa, opis, miesiace, zdjecia, gatunek, cechy:podopiecznyCechy};
    if (_id) {
        //załadowanie
        await axios.put('/api/podopieczni', {...data, _id});
    } else {
        //utworzenie
        await axios.post('/api/podopieczni', data);
 
    }
    setPowrotPodopieczni(true);
    }
    if (powrotPodopieczni) {
        router.push('/podopieczni');
    }
    async function uploadZdjecia(ev) {
        const files = ev.target?.files;
        if(files?.length > 0) {
            setIsUploding(true);
            const data = new FormData();
            for (const file of files) {
                data.append('file', file);
            }
            const res = await axios.post('/api/wstaw', data);
            setZdjecia(stareZdjecia => {
                return [...stareZdjecia, ...res.data.links];
            });
            setIsUploding(false);
        }
    }
    function ustawKolejnoscZdjec(zdjecia) {
        setZdjecia(zdjecia);
    }

    function setPodCechy(cechyNazwa, value) {
        setPodopiecznyCechy(prev => {
            const noweCechyPodopieczny = {...prev};
            noweCechyPodopieczny[cechyNazwa] = value;
            return noweCechyPodopieczny;
        });
    }

    const cechyDoUzupelnienia = [];
    if (gatunki.length > 0 && gatunek) {
        let gatInfo = gatunki.find(({_id}) => _id === gatunek);
        cechyDoUzupelnienia.push(...gatInfo.cechy);
        while(gatInfo?.nowy?._id) {
            const nowyGat = gatunki.find(({_id}) => _id === gatInfo?.nowy?._id);
            cechyDoUzupelnienia.push(...nowyGat.cechy);
            gatInfo = nowyGat;
        }
    }

    return (
            <form onSubmit={zapiszPodopieczny}>
            <label>Dodaj nowego podopiecznego schroniska</label>
            <input type="text" placeholder="Nazwa" value={nazwa} onChange={ev => setNazwa(ev.target.value)}/>
            <label>Gatunek</label>
            <select value={gatunek} onChange={ev => setGatunek(ev.target.value)}>
                <option value="">Niesklasyfikowany</option>
                {gatunki.length > 0 && gatunki.map(g => (
                    <option value={g._id}>{g.nazwa}</option>
                ))}
            </select>
            {cechyDoUzupelnienia.length > 0 && cechyDoUzupelnienia.map(c => (
                <div className="flex gap-1">
                    <label>{c.nazwa}</label>
                    <select value={podopiecznyCechy[c.nazwa]} onChange={ev => setPodCechy(c.nazwa, ev.target.value)}>
                        {c.values.map(v => (
                            <option value={v}>{v}</option>
                        ))}
                    </select>
                </div>
            ))}
            <label>
                Zdjęcia
            </label>
            <div className="mb-2 flex flex-wrap gap-1">
                <ReactSortable list={zdjecia} 
                className="flex flex-wrap gap-1"
                setList={ustawKolejnoscZdjec}>
                {!!zdjecia?.length && zdjecia.map(link => (
                    <div key={link} className="h-24 bg-white shadow-md rounded-md border border-gray-200">
                        <img src={link} alt="" className="rounded-md"/>
                    </div>
                ))}
                </ReactSortable>
                {isUploading && (
                    <div className="h-24 flex items-center">
                        <Spinner/>
                    </div>
                )}
                <label className="w-24 h-24 cursor-pointer border border-gray-200 shadow-md text-center flex flex-col items-center justify-center text-sm gap-1 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                </svg>
                <div>Wstaw</div>
                 <input type="file" onChange={uploadZdjecia}className="hidden"/>
                </label>
            </div>
            <label>Opis</label>
            <textarea placeholder="Opis" value={opis} onChange={ev => setOpis(ev.target.value)}></textarea>
            <label>Ilość miesięcy w schronisku</label>
            <input type="number" placeholder="Miesiące" value={miesiace} onChange={ev => setMiesiace(ev.target.value)}/>
            <button type="submit" className="btn-primary">Zapisz</button>
            </form>
  
    );
}