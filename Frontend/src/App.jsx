import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./Pages/HomePage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

import AdminDashboard from "./Componets/admin/AdminDashboard";
import UserDashboard from "./Componets/user/UserDashboard";
import UserInfoPage from "./Componets/user/UserInfoPage";

import MovieBooking from "./Componets/user/MovieBooking";
import AvailableTheatres from "./Componets/user/AvailableTheaters";
import UpcomingMovies from "./Componets/user/UpcomingMovie";
import MovieDetail from "./Componets/user/MovieDetails";
import PersonDetail from "./Componets/user/PersonDetails";
import AllMovies from "./Componets/user/AllMovies";
import TheatreMovies from "./Componets/user/TheaterMovies";
import MyBookings from "./Componets/user/MyBooking";
import SeatSelection from "./Componets/user/SeatSelection";
import BookingSnacks from "./Componets/user/BookingSnaks";
import BookingConfirm from "./Componets/user/BookingConfirm";
import RazorpayPayment from "./Componets/user/RazorpayPayment";

import TheatreAdminDashboard from "./Componets/theatre-admin/TheatreAdminDashboard";
import ChangePassword from "./Componets/theatre-admin/ChangePassword";

import ProtectedRoute from "./Routes/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<HomePage />} />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* User Dashboard */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/help-support"
          element={
            <ProtectedRoute role="user">
              <UserInfoPage pageKey="support" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/privacy-security"
          element={
            <ProtectedRoute role="user">
              <UserInfoPage pageKey="privacy" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/user/notifications"
          element={
            <ProtectedRoute role="user">
              <UserInfoPage pageKey="notifications" />
            </ProtectedRoute>
          }
        />

        {/* Theatre Admin */}
        <Route
          path="/theatre-admin"
          element={
            <ProtectedRoute role="theatreAdmin">
              <TheatreAdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute role="theatreAdmin">
              <ChangePassword />
            </ProtectedRoute>
          }
        />
<Route path="/my-bookings" element={<MyBookings />} />
        {/* User Dashboard */}
        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        {/* All Movies */}
        <Route
          path="/allmovies"
          element={
            <ProtectedRoute role="user">
              <AllMovies />
            </ProtectedRoute>
          }
        />

        {/* Theatre → Movies */}
        <Route
          path="/theatre/:theatreId/movies"
          element={
            <ProtectedRoute role="user">
              <TheatreMovies />
            </ProtectedRoute>
          }
        />

        {/* Movie Booking */}
        <Route
          path="/movie/:id"
          element={
            <ProtectedRoute role="user">
              <MovieBooking />
            </ProtectedRoute>
          }
        />

        {/* Movie Details */}
        <Route
          path="/moviedetail/:id"
          element={
            <ProtectedRoute role="user">
              <MovieDetail />
            </ProtectedRoute>
          }
        />

        {/* Person Details */}
        <Route
          path="/persondetail/:id"
          element={
            <ProtectedRoute role="user">
              <PersonDetail />
            </ProtectedRoute>
          }
        />

        {/* Theatres */}
        <Route
          path="/theatres"
          element={
            <ProtectedRoute role="user">
              <AvailableTheatres />
            </ProtectedRoute>
          }
        />

        {/* Upcoming */}
        <Route
          path="/upcoming-movies"
          element={
            <ProtectedRoute role="user">
              <UpcomingMovies />
            </ProtectedRoute>
          }
        />

        {/* Booking Flow */}
        <Route
          path="/seatselection/:movieId/seats"
          element={
            <ProtectedRoute role="user">
              <SeatSelection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking/snacks"
          element={
            <ProtectedRoute role="user">
              <BookingSnacks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking/confirm"
          element={
            <ProtectedRoute role="user">
              <BookingConfirm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/booking/payment"
          element={
            <ProtectedRoute role="user">
              <RazorpayPayment />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <h2 className="text-center mt-10 text-xl font-bold">
              Page Not Found
            </h2>
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;
