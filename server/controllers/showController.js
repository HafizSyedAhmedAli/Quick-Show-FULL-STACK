import axios from "axios";
import Movie from "../models/Movie.js";
import Show from "../models/Show.js";
import { inngest } from "../inngest/index.js";

const getThumbnail = async (key) => {
  const sizes = [
    "maxresdefault.jpg",
    "sddefault.jpg",
    "hqdefault.jpg",
    "mqdefault.jpg",
    "default.jpg",
  ];

  for (const size of sizes) {
    const url = `https://img.youtube.com/vi/${key}/${size}`;
    try {
      const res = await axios.head(url);
      if (res.status >= 200 && res.status < 300) {
        return url;
      }
    } catch (error) {
      const status = error.response.status;
      if (status === 404) continue;
    }
  }
};

// Get Movies Currently in the Theaters from TMDB API : /api/show/now-playing
export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get(
      "https://api.themoviedb.org/3/movie/now_playing",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );

    const movies = data.results;
    res.json({ success: true, movies: movies });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get Trailers from the TMDB API : /api/show/trailers
export const getTrailers = async (req, res) => {
  try {
    const shows = await Show.find({
      showDateTime: { $gte: new Date() },
    });

    let trailers = [];

    for (const show of shows) {
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${show.movie}/videos`,
        {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        }
      );

      trailers.push(data.results);
    }

    const trailersDataPromises = trailers.map(async (trailer) => {
      const found = trailer.find(
        (t) => t.site === "YouTube" && t.type === "Trailer" && t.official
      );

      if (!found?.key) return null;

      const thumbnail = await getThumbnail(found.key);

      return {
        thumbnail,
        videoUrl: `https://www.youtube.com/watch?v=${found.key}`,
      };
    });
    const trailersData = (await Promise.all(trailersDataPromises)).filter(
      Boolean
    );

    res.json({ success: true, trailers: trailersData });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get Trailers from the TMDB API : /api/show/trailers/:movieId
export const getTrailer = async (req, res) => {
  try {
    const { movieId } = req.params;

    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/videos`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      }
    );

    const trailerData = data.results;
    const found = trailerData.find(
      (t) => t.site === "YouTube" && t.type === "Trailer" && t.official
    );

    if (!found?.key)
      return res.json({ success: false, message: "Trailer Not Found." });

    const thumbnail = await getThumbnail(found.key);

    const trailer = {
      thumbnail,
      videoUrl: `https://www.youtube.com/watch?v=${found.key}`,
    };

    res.json({ success: true, trailer });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Add a new show to the database : /api/show/add
export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    let movie = await Movie.findById(movieId);

    if (!movie) {
      // Fetch movie details and credits from TMDB API
      const [movieDetailsResponse, movieCreditsResponse] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        }),

        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: {
            Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
          },
        }),
      ]);

      const movieApiData = movieDetailsResponse.data;
      const movieCreditsData = movieCreditsResponse.data;

      const movieDetails = {
        _id: movieId,
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        genres: movieApiData.genres,
        casts: movieCreditsData.cast,
        vote_average: movieApiData.vote_average,
        vote_count: movieApiData.vote_count,
        runtime: movieApiData.runtime,
      };

      // Add movie to the database
      movie = await Movie.create(movieDetails);
    }

    const showsToCreate = [];
    showsInput.forEach((show) => {
      const showDate = show.date;
      show.time.forEach((time) => {
        const dateTimeString = `${showDate}T${time}`;
        showsToCreate.push({
          movie: movieId,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {},
        });
      });
    });

    if (showsToCreate.length) await Show.insertMany(showsToCreate);

    await inngest.send({
      name: "app/show.added",
      data: {
        movieTitle: movie.title,
      },
    });

    res.status(201).json({ success: true, message: "Show Added Successfully" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get all shows from the database : /api/show/all
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });

    // filter unique shows
    const uniqueShows = new Set(shows.map((show) => show.movie));

    res.json({ success: true, shows: Array.from(uniqueShows) });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get a single show from the database : /api/show/:movieId
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;

    // get all upcoming shows for the movie
    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    });

    const movie = await Movie.findById(movieId);
    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];

      if (!dateTime[date]) dateTime[date] = [];

      dateTime[date].push({ time: show.showDateTime, showId: show._id });
    });

    res.json({ success: true, movie, dateTime });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
