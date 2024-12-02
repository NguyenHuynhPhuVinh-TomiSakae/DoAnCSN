'use client';
import { FaRobot } from "react-icons/fa";
import { Be_Vietnam_Pro } from 'next/font/google';
import { motion } from 'framer-motion';
import { useLoading } from '@/context/LoadingContext';

const beVietnamPro = Be_Vietnam_Pro({
    subsets: ['vietnamese'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
});

const Navbar = () => {
    const { isLoading } = useLoading();

    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 h-16 bg-white z-50 flex justify-between items-center px-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{
                opacity: isLoading ? 0 : 1,
                y: isLoading ? -20 : 0
            }}
            transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: isLoading ? 0 : 2
            }}
        >
            <div className={`${beVietnamPro.className} font-bold text-xl`}>
                TRANG CHỦ
            </div>
            <div className="flex items-center">
                <FaRobot className="w-8 h-8" />
            </div>
        </motion.nav>
    );
};

export default Navbar; 