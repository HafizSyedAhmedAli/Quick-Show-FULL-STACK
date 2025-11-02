import { Heart, PlayCircleIcon, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import ReactPlayer from 'react-player';
import { useNavigate, useParams } from "react-router-dom";
import BlurCircle from "../components/BlurCircle";
import DateSelect from "../components/DateSelect";
import Loading from "../components/Loading";
import MovieCard from "../components/MovieCard";
import { useAppContext } from "../context/AppContext";
import timeFormat from "../lib/timeFormat";

const MovieDetails = () => {
    const { id } = useParams();
    const [show, setShow] = useState(null);
    const [trailer, setTrailer] = useState({});
    const navigate = useNavigate();
    const trailerRef = useRef(null);

    const { shows, axios, getToken, user, favoriteMovies, fetchFavoriteMovies, image_base_url } = useAppContext();

    const getShow = async () => {
        try {
            const { data } = await axios.get(`/api/show/${id}`);
            if (data.success) setShow(data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleFavorite = async () => {
        try {
            if (!user) return toast.error("Please login to proceed.");

            const config = {
                headers: { Authorization: `Bearer ${await getToken()}` },
            };
            const { data } = await axios.post("/api/user/my-favorite", { movieId: id }, config);

            if (data.success) {
                await fetchFavoriteMovies();
                toast.success(data.message);
            }

        } catch (error) {
            console.log(error);
        }
    }

    const fetchTrailer = async () => {
        try {
            const { data } = await axios.get(`/api/show/trailers/${id}`);
            setTrailer(data.trailer);
        } catch (error) {
            console.log(error);
        }
    }

    const scrollToTrailer = () => {
        const el = trailerRef.current;
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    useEffect(() => {
        getShow();
        fetchTrailer();
    }, [id]);

    return show ? (
        <div className="px-6 md:px-16 lg:px-40 pt-30 md:pt-50">
            <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
                <img
                    className="max-md:mx-auto rounded-xl h-104 max-w-70 object-cover"
                    src={image_base_url + show.movie.poster_path}
                    alt=""
                />

                <div className="relative flex flex-col gap-3">
                    <BlurCircle top="-100px" left="-100px" />
                    <p className="text-primary">ENGLISH</p>
                    <h1 className="text-4xl font-semibold max-w-96 text-balance">
                        {show.movie.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-300">
                        <Star className="size-5 text-primary fill-primary" />
                        {show.movie.vote_average.toFixed(1)} User Rating
                    </div>
                    <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
                        {show.movie.overview}
                    </p>

                    <p>
                        {timeFormat(show.movie.runtime)} &middot;{" "}
                        {show.movie.genres.map((genre) => genre.name).join(", ")} &middot;{" "}
                        {show.movie.release_date.split("-")[0]}
                    </p>

                    <div className="flex items-center flex-wrap gap-4 mt-4">
                        <button className="flex items-center gap-2 px-7 py-3 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95" onClick={scrollToTrailer}>
                            <PlayCircleIcon className="size-5" />
                            Watch Trailer
                        </button>
                        <a
                            href="#dateSelect"
                            className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95"
                        >
                            Buy Tickets
                        </a>
                        <button onClick={handleFavorite} className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95">
                            <Heart className={`size-5 ${favoriteMovies.find(movie => movie._id === id) && "fill-primary text-primary"}`} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="py-20 overflow-visible">
                <p className="text-gray-300 font-medium text-lg max-w-[960px]">Trailer</p>
                <div id="trailer" className="relative mt-6" ref={trailerRef}>
                    <BlurCircle top="-100px" right="-100px" />
                    <ReactPlayer className="mx-auto max-w-full" src={trailer.videoUrl} controls={false} width={960} height={540} />
                </div>
            </div>

            <p className="text-lg font-medium mt-20">Your Favorite Cast</p>
            <div className="no-scrollbar overflow-x-auto mt-8 pb-4">
                <div className="flex items-center gap-4 w-max px-4">
                    {show.movie.casts.slice(0, 12).map((cast, index) => (
                        <div key={index} className="flex flex-col items-center text-center">
                            <img
                                className="rounded-full h-20 aspect-square object-cover"
                                src={image_base_url + cast.profile_path}
                                alt=""
                            />
                            <p className="font-medium text-xs mt-3">{cast.name}</p>
                        </div>
                    ))}
                </div>
            </div>

            <DateSelect dateTime={show.dateTime} id={id} />

            <p className="text-lg font-medium mt-20 mb-8">You may also like</p>

            <div className="flex flex-wrap max-sm:justify-center gap-8">
                {shows.slice(0, 4).map((movie, index) => (
                    <MovieCard key={index} movie={movie} />
                ))}
            </div>

            <div className="flex justify-center mt-20">
                <button
                    className="bg-primary hover:bg-primary-dull px-10 py-3 text-sm transition rounded-md font-medium cursor-pointer"
                    onClick={() => {
                        navigate("/movies");
                        scrollTo(0, 0);
                    }}
                >
                    Show more
                </button>
            </div>
        </div>
    ) : (
        <Loading />
    );
};

export default MovieDetails;
