"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../Navbar/Navbar";

interface UserLayoutProps {
    children: React.ReactElement; 
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
    const [scrollY, setScrollY] = useState(0);

    const child = React.Children.only(children); 

    return (
        <motion.div
            style={{
                backgroundImage: 'repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.2) 0px, rgba(255, 255, 255, 0.5) 0.5px, transparent 0.5px, transparent 3px)',
                backgroundPosition: `0 ${scrollY * 0.001}px`, // Adjust multiplier for speed
                backgroundSize: '100% 100%',
            }}
            className="relative h-screen"
        >
            <div className="absolute inset-0 bg-black bg-opacity-95 pointer-events-none" />
            <div className="z-10 relative">
                <Navbar />
                {React.cloneElement(child, { setScrollY })} {/* Pass the setScrollY function */}
            </div>
        </motion.div>
    );
}

export default UserLayout;
