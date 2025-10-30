import { clerkClient } from "@clerk/express";
import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";

// Get User Bookings : /api/user/bookings
export const getUserBookings = async (req, res) => {
  try {
    const { userId: user } = req.auth();

    const bookings = await Booking.find({ user })
      .populate({
        path: "show",
        populate: { path: "movie" },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Update Favorite Movie in Clerk User Metadata : /api/user/my-favorite
export const updateFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const { userId } = req.auth();

    const user = await clerkClient.users.getUser(userId);

    if (!user.privateMetadata.favorites) {
      user.privateMetadata.favorites = [];
    }

    if (!user.privateMetadata.favorites.includes(movieId)) {
      user.privateMetadata.favorites.push(movieId);
    } else {
      user.privateMetadata.favorites = user.privateMetadata.favorites.filter(
        (item) => item !== movieId
      );
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: user.privateMetadata,
    });

    res.json({ success: true, message: "Favorite movies updated" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get favorite movies : /api/user/favorites
export const getFavorites = async (req, res) => {
  try {
    const { userId } = req.auth();

    const user = await clerkClient.users.getUser(userId);
    const favorites = user.privateMetadata.favorites;

    // Get movies from database
    const movies = await Movie.find({ _id: { $in: favorites } });

    res.json({ success: true, movies });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
