"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import {
  FaPlaneDeparture,
  FaPlaneArrival,
  FaCalendarAlt,
  FaUser,
  FaExchangeAlt,
} from "react-icons/fa";

const flight_backend = process.env.NEXT_PUBLIC_FLIGHTS_API;

export default function HeroSection() {
  const [airports, setAirports] = useState([]);
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [tripDate, setTripDate] = useState("");
  const [trevellers, setTrevellers] = useState(1);

  const router = useRouter();

  // small SVG placeholder (data URI) — used when remote images fail
  const placeholderSvg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>
    <rect width='100%' height='100%' fill='#f3f4f6'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-size='18' font-family='Arial'>
      Image unavailable
    </text>
  </svg>`;
  const placeholder = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    placeholderSvg
  )}`;

  // Fetch airports dynamically
  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const res = await axios.get(`${flight_backend}/api/v1/airports`);
        const options = res.data.data.map((a) => ({
          value: a.code,
          label: `${a.name} (${a.code})`,
        }));
        setAirports(options);
      } catch (error) {
        console.error("Error fetching airports:", error);
      }
    };
    fetchAirports();
  }, []);

  useUserId();

  // Handle search
  const handleSearch = async () => {
    if (!departure || !arrival || !tripDate) {
      alert("Please fill all fields");
      return;
    }
    try {
      const res = await axios.get(`${flight_backend}/api/v1/flights`, {
        params: {
          trips: `${departure.value}-${arrival.value}`,
          tripDate,
          trevellers: trevellers,
        },
      });
      console.log("Flights:", res.data.data);
    } catch (error) {
      console.error("Error fetching flights:", error);
    }
    router.push(
      `/flights?trips=${departure.value}-${arrival.value}&tripDate=${tripDate}&trevellers=${trevellers}`
    );
  };

  // Swap From & To
  const handleSwap = () => {
    const temp = departure;
    setDeparture(arrival);
    setArrival(temp);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-white">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">
          <div className="absolute inset-0 bg-black opacity-20"></div>
        </div>

        {/* Floating Plane Illustration */}
        <div className="absolute inset-0 bg-[url('https://img.icons8.com/ios/500/ffffff/airplane-take-off.png')] bg-no-repeat bg-right-top bg-contain opacity-10 animate-bounce-slow"></div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-6 max-w-5xl w-full animate-fadeInUp">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
            Fly Smarter. Travel Better.
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 drop-shadow-sm">
            Find the best flight deals, book instantly, and make every trip unforgettable.
          </p>

          {/* Search bar */}
          <div className="flex flex-col md:flex-row gap-4 bg-white rounded-full shadow-xl px-4 py-4 items-center backdrop-blur-md border border-gray-200">
            {/* From */}
            <div className="flex items-center gap-2 flex-1 text-gray-700">
              <FaPlaneDeparture className="text-blue-600" />
              <Select
                className="flex-1"
                options={airports}
                value={departure}
                onChange={setDeparture}
                placeholder="From"
                isSearchable
              />
            </div>

            {/* Swap button */}
            <button
              onClick={handleSwap}
              className="p-3 bg-gray-100 rounded-full hover:bg-gray-200 transition"
              title="Swap"
            >
              <FaExchangeAlt className="text-blue-600" />
            </button>

            {/* To */}
            <div className="flex items-center gap-2 flex-1 text-gray-700">
              <FaPlaneArrival className="text-blue-600" />
              <Select
                className="flex-1"
                options={airports}
                value={arrival}
                onChange={setArrival}
                placeholder="To"
                isSearchable
              />
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 flex-1 text-gray-700">
              <FaCalendarAlt className="text-blue-600" />
              <input
                type="date"
                className="flex-1 px-4 py-3 rounded-full focus:outline-none"
                value={tripDate}
                min={new Date().toISOString().split("T")[0]} // disable past dates
                onChange={(e) => setTripDate(e.target.value)}
              />
            </div>

            {/* Travellers */}
            <div className="flex items-center gap-2 text-gray-700">
              <FaUser className="text-blue-600" />
              <input
                type="number"
                min="1"
                className="w-20 px-4 py-3 rounded-full focus:outline-none"
                value={trevellers}
                onChange={(e) => setTrevellers(e.target.value)}
                placeholder="Trav"
              />
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 hover:shadow-lg transition"
            >
              Search
            </button>
          </div>
        </div>
      </section>

      {/* My Bookings button */}
      <div className="absolute top-4 right-4">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 hover:shadow-lg transition"
          onClick={() => {
            router.push("/book");
          }}
        >
          My Bookings
        </button>
      </div>

      {/* Scrollable Content Sections */}

      {/* Why Choose Us */}
      <section className="relative w-full bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Why Choose Us?
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-12">
            We make booking flights simple, secure, and affordable. Explore exclusive deals,
            get real-time updates, and enjoy a seamless booking experience.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl shadow-md hover:shadow-xl transition bg-gradient-to-br from-blue-50 to-indigo-50">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Best Deals</h3>
              <p className="text-gray-600">Get access to exclusive discounts and offers tailored just for you.</p>
            </div>
            <div className="p-6 rounded-2xl shadow-md hover:shadow-xl transition bg-gradient-to-br from-blue-50 to-indigo-50">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Fast Booking</h3>
              <p className="text-gray-600">Book flights in seconds with our user-friendly interface.</p>
            </div>
            <div className="p-6 rounded-2xl shadow-md hover:shadow-xl transition bg-gradient-to-br from-blue-50 to-indigo-50">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">Secure Payments</h3>
              <p className="text-gray-600">We use top-level encryption to keep your transactions safe.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="relative w-full bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-10">
            Popular Destinations
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {["Paris", "New York", "Tokyo", "Dubai"].map((city, idx) => (
              <div
                key={idx}
                className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2"
              >
                <img
                  src={`https://source.unsplash.com/400x300/?${city},city`}
                  alt={city}
                  loading="lazy"
                  onError={(e) => {
                    // fallback to placeholder data URI if remote image fails
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = placeholder;
                  }}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 bg-white">
                  <h3 className="text-lg font-semibold text-gray-800">{city}</h3>
                  <p className="text-sm text-gray-500">Explore flights to {city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative w-full bg-indigo-700 text-white py-12 px-6 mt-10">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-3">FlySmarter</h3>
            <p className="text-sm text-indigo-200">Your trusted partner for hassle-free flight bookings.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2 text-indigo-200 text-sm">
              <li>About Us</li>
              <li>Contact</li>
              <li>Support</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">Follow Us</h3>
            <ul className="flex gap-4 text-indigo-200 text-xl">
              <li>🌐</li>
              <li>🐦</li>
              <li>📷</li>
            </ul>
          </div>
        </div>
        <p className="text-center text-indigo-300 text-sm mt-8">© {new Date().getFullYear()} FlySmarter. All rights reserved.</p>
      </footer>
    </>
  );
}

export function useUserId() {
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    let storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      storedUserId = uuidv4();
      localStorage.setItem("userId", storedUserId);
    }
    setUserId(storedUserId);
  }, []);
  return userId;
}
