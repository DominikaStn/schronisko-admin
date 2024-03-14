import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

function Gatunki({swal}) {
    const [zedytowanyGatunek, setZedytowanyGatunek] = useState(null);
    const [nazwa, setNazwa] = useState('');
    const [nowyGatunek, setNowyGatunek] = useState('');
    const [gatunki, setGatunki] = useState([]);
    const [cechy, setCechy] = useState([]);
    useEffect(() => {
        fetchGatunki();
    }, []);
    function fetchGatunki() {
        axios.get('/api/gatunki').then(result => {
            setGatunki(result.data);
         });
    }
    async function zapiszGatunek(ev){
        ev.preventDefault();
        const data = {nazwa, nowyGatunek, cechy:cechy.map(c => ({nazwa:c.nazwa, values:c.values.split(',')})),};
        if (zedytowanyGatunek) {
            data._id = zedytowanyGatunek._id;
            await axios.put('/api/gatunki', data);
            setZedytowanyGatunek(null);
        } else {
        await axios.post('/api/gatunki', data);
    }
        setNazwa('');
        //wyczyszczenie okien dotyczących cech po zapisaniu obiektu
        setNowyGatunek('');
        setCechy([]);
        fetchGatunki();
    }

    function edytujGatunek(gatunek){
        setZedytowanyGatunek(gatunek);
        setNazwa(gatunek.nazwa);
        setNowyGatunek(gatunek.nowy?._id);
        //dodając poniższą linijkę kodu, przy edycji wyświetlają nam się cechy, które obiekt już posiada
        setCechy(gatunek.cechy.map(({nazwa, values}) => ({nazwa, values:values.join(',') })));
    }

    function usunGatunek(gatunek) {
        swal.fire({
            title: `Czy na pewno chcesz usunąć ${gatunek.nazwa}?`,
            //text: `${gatunek.nazwa}?`,
            showCancelButton: true,
            cancelButtonText: 'Anuluj',
            confirmButtonText: 'Tak, usuń',
            confirmButtonColor: '#d55',
            //reverseButtons: true,
        }).then(async result => {
            if(result.isConfirmed) {
                const {_id} = gatunek;
                await axios.delete('/api/gatunki?_id='+_id);
                fetchGatunki();
            }
        });
    }
    function dodajCeche() {
        //prev = previous
        setCechy(prev => {
            return [...prev, {nazwa:'', values:''}];
        });
    }

    function ustawRodzajCechy(index, cecha, nowaNazwa) {
        setCechy(prev => {
            const cechy = [...prev];
            cechy[index].nazwa = nowaNazwa;
            return cechy;
        });
    }
    function ustawWartoscCechy(index, cecha, noweWartosci) {
        setCechy(prev => {
            const cechy = [...prev];
            cechy[index].values = noweWartosci;
            return cechy;
        });
    }
    function usunCeche(indexDoUsuniecia) {
        setCechy(prev => {
        //c od cechy, cIndex = index cechy
            return [...prev].filter((c, cIndex) => {
                return cIndex !== indexDoUsuniecia;
            });
        });
    }
    return (
        <Layout>
            <h1>Gatunki</h1>
            <label>{zedytowanyGatunek ? `Edytuj zwierzę ${zedytowanyGatunek.nazwa}` : 'Rodzaj zwierzęcia'}</label>
            <form onSubmit={zapiszGatunek}>
            <div className="flex gap-1">
            <input type="text" placeholder={'Nazwa'} onChange={ev => setNazwa(ev.target.value)} value={nazwa}/>
            <select onChange={ev => setNowyGatunek(ev.target.value)} value={nowyGatunek}>
                <option value="">Nowy gatunek</option>
                {gatunki.length > 0 && gatunki.map(gatunek => (
                    <option value={gatunek._id}>{gatunek.nazwa}</option>
                    ))}
            </select>
            </div>
            <div className="mb-2">
                <label className="block">Cechy</label>
                <button onClick={dodajCeche} type="button" className="btn-default mb-2">Dodaj</button>
                {cechy.length > 0 && cechy.map((cecha, index) => (
                    <div className="flex gap-1 mb-2">
                        <input type="text" value={cecha.nazwa} className="mb-0" onChange={ev => ustawRodzajCechy(index, cecha, ev.target.value)} placeholder="rodzaj np. umaszczenie"/>
                        <input type="text" value={cecha.values} className="mb-0" onChange={ev => ustawWartoscCechy(index, cecha, ev.target.value)} placeholder="wartości (po przecinkach)" />
                        <button onClick={() => usunCeche(index)} type="button" className="btn-default text-sm">Usuń</button>
                    </div>
                ))}
            </div>
            <div className="flex gap-1">
            <button type="submit" className="btn-primary py-1">Zapisz</button>
            {zedytowanyGatunek && (
                //poniższa linijka dodatkowo pozwala na wyczyszczenie zawartości okna po wciśnięciu "Anuluj"
            <button type="button" onClick={() => {setZedytowanyGatunek(null); setNazwa(''); setNowyGatunek(''); setCechy([]); }} className="btn-default">Anuluj</button>
            )}
            </div>
            </form>
            {!zedytowanyGatunek && (
                <table className="basic mt-2">
                <thead>
                    <tr>
                        <td>Rodzaj zwierzęcia</td>
                        <td>Nowy gatunek</td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {gatunki.length > 0 && gatunki.map(gatunek => (
                        <tr>
                            <td>{gatunek.nazwa}</td>
                            <td>{gatunek?.nowy?.nazwa}</td>
                            <td>
                                <button onClick={() => edytujGatunek(gatunek)} className="btn-primary mr-1">Edytuj</button>
                                <button onClick={() => usunGatunek(gatunek)} className="btn-primary">Usuń</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
        </Layout>
    );
}

export default withSwal(({swal}, ref) => (
    <Gatunki swal={swal}/>
));