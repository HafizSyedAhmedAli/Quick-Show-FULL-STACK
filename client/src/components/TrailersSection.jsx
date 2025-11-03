import { useEffect, useState } from "react";
import ReactPlayer from 'react-player';
import BlurCircle from "./BlurCircle";
import { PlayCircle } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const TrailersSection = () => {

    const [trailers, setTrailers] = useState([]);
    const [currentTrailer, setCurrentTrailer] = useState({});
    const { axios } = useAppContext();

    const fetchTrailers = async () => {
        try {
            const { data } = await axios.get("/api/show/trailers");
            setTrailers(data.trailers);
            console.log(data);
            

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchTrailers();
    }, []);

    useEffect(() => {
        if (trailers.length) {
            setCurrentTrailer(trailers[0]);
        }
    }, [trailers]);

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
            <p className="text-gray-300 font-medium text-lg max-w-[960px]">Trailers</p>

            <div className="relative mt-6">
                <BlurCircle top="-100px" right="-100px" />
                <ReactPlayer className="mx-auto max-w-full" src={currentTrailer.videoUrl} controls={false} width={960} height={540} />
            </div>

            <div className="group grid grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto">
                {trailers.map((trailer) => (
                    <div key={trailer.thumbnail} className="relative group-hover:not-hover:opacity-50 hover:-translate-y-1 duration-300 transition max-md:h-60 md:max-h-60 cursor-pointer" onClick={() => setCurrentTrailer(trailer)}>
                        <img className="rounded-lg w-full h-full brightness-75" src={trailer.thumbnail} alt="trailer" />
                        <PlayCircle className="absolute top-1/2 left-1/2 w-5 md:w-8 h-5 md:h-12 transform -translate-x-1/2 -translate-y-1/2" strokeWidth={1.6} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TrailersSection;