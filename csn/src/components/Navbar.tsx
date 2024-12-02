'use client';
import { FaRobot } from "react-icons/fa";
import { Be_Vietnam_Pro } from 'next/font/google';
import { motion } from 'framer-motion';
import { useLoading } from '@/context/LoadingContext';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

const beVietnamPro = Be_Vietnam_Pro({
    subsets: ['vietnamese'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
});

const Navbar = () => {
    const { isLoading } = useLoading();
    const lineRef = useRef(null);
    const line1Ref = useRef(null);
    const line2Ref = useRef(null);
    const text1Ref = useRef(null);
    const text2Ref = useRef(null);

    gsap.registerPlugin(TextPlugin);

    useEffect(() => {
        if (!isLoading) {
            // Animation cho đường kẻ dọc
            gsap.fromTo(lineRef.current,
                { height: 0 },
                { height: '8rem', duration: 1, delay: 2.5 }
            );

            // Animation cho các đường kẻ ngang và text
            gsap.fromTo(line1Ref.current,
                { width: 0 },
                { width: '4rem', duration: 0.5, delay: 3.5 }
            );

            // Animation cho text1 với hiệu ứng đánh chữ
            gsap.fromTo(text1Ref.current,
                { opacity: 0, x: -50, text: "" },
                { opacity: 1, x: -150, text: "Xin chào!", duration: 0.5, delay: 4 }
            );

            // Animation cho line2 sau khi line1 hoàn tất
            gsap.fromTo(line2Ref.current,
                { width: 0 },
                { width: '4rem', duration: 0.5, delay: 4.7 }
            );

            // Animation cho text2 với hiệu ứng đánh chữ
            gsap.fromTo(text2Ref.current,
                { opacity: 0, x: -70, text: "" },
                { opacity: 1, x: -300, text: "Mình có thể giúp gì cho bạn?", duration: 0.5, delay: 5.2 }
            );
        }
    }, [isLoading]);

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
            <div className="flex items-center relative">
                <FaRobot className="w-8 h-8" />
                <div ref={lineRef} className="absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 bg-black">
                    <div className="absolute top-8">
                        <div className="flex items-center">
                            <div ref={line1Ref} className="w-16 h-0.5 bg-black -translate-x-16"></div>
                            <div ref={text1Ref} className="absolute left-0 -translate-x-20 border-2 border-black bg-white text-black rounded-lg px-5 py-1.5 whitespace-nowrap">
                                Xin chào!
                            </div>
                        </div>
                    </div>
                    <div className="absolute top-20">
                        <div className="flex items-center">
                            <div ref={line2Ref} className="w-16 h-0.5 bg-black -translate-x-16"></div>
                            <div ref={text2Ref} className="absolute left-0 -translate-x-20 border-2 border-black bg-white text-black rounded-lg px-5 py-1.5 whitespace-nowrap">
                                Mình có thể giúp gì cho bạn?
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar; 