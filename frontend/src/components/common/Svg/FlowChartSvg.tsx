import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const svgAnimation = {
    hidden: { opacity: 0, pathLength: 0, fillOpacity: 0 },
    visible: {
        opacity: 1,
        pathLength: 1,
        fillOpacity: 1,
        transition: {
            duration: 2,
            ease: 'easeInOut',
        },
    },
};

export default function FlowChartSvg() {
    const [isVisible, setIsVisible] = useState(false);
    const svgRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (entry.intersectionRatio >= 0.4) {
                        setIsVisible(true);
                        observer.disconnect(); 
                    }
                }
            },
            {
                threshold: 0.4,
            }
        );

        if (svgRef.current) {
            observer.observe(svgRef.current);
        }

        return () => {
            if (svgRef.current) {
                observer.unobserve(svgRef.current);
            }
        };
    }, []);

    return (
        <motion.svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            initial="hidden"
            animate={isVisible ? 'visible' : 'hidden'}
        >
            <motion.path
                d="M 50 0 L 50 15"
                stroke="white"
                strokeWidth="0.2"
                fill="none"
                variants={svgAnimation}
            />

            <motion.polygon
                points="50,15 55,20 50,25 45,20"
                stroke="white"
                strokeWidth="0.2"
                fill="green"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
            />

            <motion.path
                d="M 55 20 L 70 20 Q 72 20,72 22 L 72 37"
                stroke="white"
                strokeWidth="0.2"
                fill="none"
                variants={svgAnimation}
                transition={{ delay: 1 }}
            />

            <motion.polygon
                points="72,37 77,42 72,47 67,42"
                stroke="white"
                strokeWidth="0.2"
                fill="green"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
            />

            <motion.path
                d="M 77 42 L 97 42 Q 99 42,99 44 L 99 59"
                stroke="white"
                strokeWidth="0.2"
                fill="none"
                variants={svgAnimation}
                transition={{ delay: 2 }}
            />

            <motion.rect
                x="89"
                y="59"
                width="20"
                height="8"
                stroke="white"
                strokeWidth="0.2"
                fill="lightslategrey"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8, duration: 0.5 }}
            />

            <motion.path
                d="M 99 67 L 99 99"
                stroke="white"
                strokeWidth="0.2"
                fill="none"
                variants={svgAnimation}
                transition={{ delay: 5.5 }}
            />




            <motion.path
                d="M 72 47 L 72 57"
                stroke="white"
                strokeWidth="0.2"
                fill="none"
                variants={svgAnimation}
                transition={{ delay: 5.5 }}
            />

            <motion.polygon
                points="72,57 77,62 72,67 67,62"
                stroke="white"
                strokeWidth="0.2"
                fill="green"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
            />

            <motion.path
                d="M 72 67 L 72 99"
                stroke="white"
                strokeWidth="0.2"
                fill="none"
                variants={svgAnimation}
                transition={{ delay: 5.5 }}
            />

            <motion.path
                d="M 67 62 L 50 62 Q 48 62,48 64 L 48 78"
                stroke="white"
                strokeWidth="0.2"
                fill="none"
                variants={svgAnimation}
                transition={{ delay: 5.5 }}
            />

            <motion.rect
                x="38"
                y="78"
                width="20"
                height="8"
                stroke="white"
                strokeWidth="0.2"
                fill="lightslategrey"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8, duration: 0.5 }}
            />

            <motion.path
                d="M 48 86 L 48 99"
                stroke="white"
                strokeWidth="0.2"
                fill="none"
                variants={svgAnimation}
                transition={{ delay: 5.5 }}
            />
            <motion.path
                d="M 45 20 L 30 20 Q 28 20, 28 22 L 28 32"
                stroke="white"
                strokeWidth="0.2"
                fill="none"
                variants={svgAnimation}
                transition={{ delay: 5.5 }}
            />
            <motion.polygon
                points="28,32 33,37 28,42 23,37"
                stroke="white"
                strokeWidth="0.2"
                fill="green"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
            />

            <motion.path
                d="M 28 42 L 28 49 "
                stroke="white"
                strokeWidth="0.2"
                fill="none"
                variants={svgAnimation}
                transition={{ delay: 5.5 }}
            />

            <motion.rect
                x="18"
                y="48"
                width="20"
                height="8"
                stroke="white"
                strokeWidth="0.2"
                fill="lightslategrey"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8, duration: 0.5 }}
            />

            <motion.path
                d="M 28 56 L 28 65 "
                stroke="white"
                strokeWidth="0.2"
                fill="none"
                variants={svgAnimation}
                transition={{ delay: 5.5 }}
            />

            <motion.polygon
                points="28,65 33,70 28,75 23,70"
                stroke="white"
                strokeWidth="0.2"
                fill="green"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2, duration: 0.5 }}
            />

            <motion.path
                d="M 28 75 L 28 99 "
                stroke="white"
                strokeWidth="0.2"
                fill="none"
                variants={svgAnimation}
                transition={{ delay: 5.5 }}
            />

            <motion.path
                d="M 23 70 L 10 70 Q 8 70, 8 72 L 8 79 "
                stroke="white"
                strokeWidth="0.2"
                fill="none"
                variants={svgAnimation}
                transition={{ delay: 5.5 }}
            />

            <motion.rect
                x="-2"
                y="79"
                width="20"
                height="8"
                stroke="white"
                strokeWidth="0.2"
                fill="lightslategrey"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2, duration: 0.5 }}
            />

            <motion.path
                d="M 8 87 L 8 99 "
                stroke="white"
                strokeWidth="0.2"
                fill="none"
                variants={svgAnimation}
                transition={{ delay: 5.5 }}
            />

        </motion.svg>
    );
}
