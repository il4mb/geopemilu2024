



interface PaslonI {
    id: string
    nama: string
    nomor_urut: number
    warna: string
}
interface Args {
    data: PaslonI[]
}



const Paslon = (arg: PaslonI) => {

    let nomor_urut = arg.nomor_urut < 10 ? `0${arg.nomor_urut}` : arg.nomor_urut;
    let photo_url = "/img/" + nomor_urut + ".jpg";

    return (
        <>
            <div className="w-full flex items-center justify-start align-middle mb-1">

                <span className="w-[18px] h-[18px] block me-2 rounded-sm" style={{ backgroundColor: arg.warna }}></span>
                <span className="text-sm font-bold text-blue-400">[{nomor_urut}]</span>
                <h5 className="ms-3 text-sm text-gray-400 text-center">{arg.nama}</h5>

            </div>
        </>
    )
}


function PaslonContainer(args: Args) {
    // This assumes args.data could be an object where each key maps to a PaslonI object
    if (typeof args.data !== 'object' || args.data === null || Array.isArray(args.data)) {
        return <div>No data available</div>;
    }

    const entries = Object.values(args.data); // This would need adjusting based on the actual shape of data

    if (entries.length === 0) {
        return <div>No data available</div>;
    }

    // console.log(entries)

    return (
        <>
            <div className="w-full flex flex-wrap">
                {entries.map((paslon, index) => (
                    <Paslon key={index} nama={(paslon as PaslonI).nama} nomor_urut={(paslon as PaslonI).nomor_urut} id={(paslon as PaslonI).id} warna={(paslon as PaslonI).warna} />
                ))}
            </div>
        </>
    );
}


export { PaslonContainer }
export type { PaslonI }

