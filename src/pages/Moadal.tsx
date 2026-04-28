import { useState } from "react";
import { Link } from "react-router-dom";
export default function AuthModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative z-10 w-[90%] max-w-md rounded-2xl p-6 shadow-xl 
        bg-white text-black 
        dark:bg-[#0f0f0f] dark:text-white border border border ">

                {/* Title */}
                <h2 className="text-xl font-semibold mb-3 text-center">
                    You are not logged in
                </h2>

                {/* Message */}
                <p className="text-sm text-center mb-6 text-gray-600 dark:text-gray-400">
                    Please log in or create an account to continue.
                </p>

                {/* Buttons */}
                <div className="flex gap-4 justify-center">

                    <Link to="/login">
                        <button
                            className="px-5 py-2 rounded-lg border border-orange-500 text-orange-500 
      hover:bg-orange-500 hover:text-white transition"
                        >
                            Login
                        </button>
                    </Link>

                    <Link to="/signup">
                        <button
                            className="px-5 py-2 rounded-lg bg-orange-500 text-white 
      hover:bg-orange-600 transition"
                        >
                            Sign Up
                        </button>
                    </Link>

                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 hover:text-orange-500"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}