'use client';
import { FaRobot } from "react-icons/fa";
import { Be_Vietnam_Pro } from 'next/font/google';
import { motion } from 'framer-motion';
import { useLoading } from '@/context/LoadingContext';
import { useEffect, useRef, useState } from 'react';
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
    const line3Ref = useRef(null);
    const text1Ref = useRef(null);
    const text2Ref = useRef(null);
    const inputRef = useRef(null);
    const [isDark, setIsDark] = useState(false);
    const [isIntroView, setIsIntroView] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(true);
    const [isInShowAIIntro, setIsInShowAIIntro] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const threshold = window.innerHeight * 0.8;
            const newIsDark = scrollPosition > threshold;

            if (newIsDark !== isDark) {
                setShouldAnimate(true);
                gsap.killTweensOf([lineRef.current, line1Ref.current, line2Ref.current, line3Ref.current, text1Ref.current, text2Ref.current, inputRef.current]);
            }

            setIsDark(newIsDark);
            setIsIntroView(newIsDark);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isDark]);

    useEffect(() => {
        const handleScroll = () => {
            const showAIIntroElement = document.querySelector('.showai-intro');
            if (showAIIntroElement) {
                const rect = showAIIntroElement.getBoundingClientRect();
                setIsInShowAIIntro(rect.top <= 0 && rect.bottom >= 0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    gsap.registerPlugin(TextPlugin);

    useEffect(() => {
        if (!isLoading) {
            gsap.fromTo(lineRef.current,
                { height: 0 },
                {
                    height: isIntroView ? '4rem' : '8rem',
                    duration: 1,
                    ease: "power2.out"
                }
            );
        }
    }, [isLoading, isDark, isIntroView]);

    useEffect(() => {
        if (!isLoading && shouldAnimate) {
            gsap.set([line1Ref.current, line2Ref.current, line3Ref.current], {
                width: 0
            });

            gsap.fromTo(line1Ref.current,
                { width: 0 },
                { width: '4rem', duration: 0.5, delay: 1.5, ease: "power2.out" }
            );

            gsap.fromTo(text1Ref.current,
                { opacity: 0, x: -50, text: "" },
                { opacity: 1, x: -150, text: isIntroView ? "Phân tích" : "Xin chào!", duration: 0.5, delay: 2 }
            );

            gsap.fromTo(line2Ref.current,
                { width: 0 },
                { width: '4rem', duration: 0.5, delay: 2.7 }
            );

            gsap.fromTo(text2Ref.current,
                { opacity: 0, x: -70, text: "" },
                { opacity: 1, x: -300, text: "Mình có thể giúp gì cho bạn?", duration: 0.5, delay: 3.2 }
            );

            gsap.fromTo(line3Ref.current,
                { width: 0 },
                { width: '4rem', duration: 0.5, delay: 3.9 }
            );

            gsap.fromTo(inputRef.current,
                { opacity: 0, x: -70 },
                { opacity: 1, x: -300, duration: 0.5, delay: 4.4 }
            );

            setShouldAnimate(false);
        }
    }, [isLoading, shouldAnimate, isIntroView]);

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 h-16 z-50 flex justify-between items-center px-8 transition-colors duration-300 ${isDark || isInShowAIIntro ? 'bg-black' : 'bg-white'
                }`}
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
            <div className={`${beVietnamPro.className} font-bold text-xl transition-colors duration-300 ${isDark ? 'text-white' : 'text-black'
                }`}>
                {isIntroView ? 'GIỚI THIỆU' : 'TRANG CHỦ'}
            </div>

            {isIntroView && (
                <div className="flex-1 max-w-md mx-auto flex justify-center">
                    <motion.div
                        className="h-[3.5em] mx-auto border-2 border-white rounded-full overflow-hidden flex items-center relative bg-black"
                        initial={{ width: '5em' }}
                        animate={{ width: '35em' }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <input
                            type="text"
                            className="w-full bg-black text-white placeholder-gray-400 px-4 py-1 focus:outline-none text-sm"
                        />
                        <div className="search-icon ml-auto pr-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-6 h-6 text-white"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                    </motion.div>
                </div>
            )}

            <div className="flex items-center relative">
                <FaRobot className={`w-8 h-8 transition-colors duration-300 ${isDark ? 'text-white' : 'text-black'}`} />
                <div ref={lineRef} className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0.5 transition-colors duration-300 ${isDark ? 'bg-white' : 'bg-black'
                    }`}>
                    {!isIntroView ? (
                        <>
                            <div className="absolute top-8">
                                <div className="flex items-center">
                                    <div ref={line1Ref} className={`w-16 h-0.5 -translate-x-16 transition-colors duration-300 ${isDark ? 'bg-white' : 'bg-black'
                                        }`}></div>
                                    <div ref={text1Ref} className={`absolute left-0 -translate-x-20 border-2 transition-colors duration-300 ${isDark ? 'border-white text-white bg-black' : 'border-black text-black bg-white'
                                        } rounded-lg px-5 py-1.5 whitespace-nowrap`}>
                                        {isIntroView ? "Phân tích" : "Xin chào!"}
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-20">
                                <div className="flex items-center">
                                    <div ref={line2Ref} className={`w-16 h-0.5 -translate-x-16 transition-colors duration-300 ${isDark ? 'bg-white' : 'bg-black'
                                        }`}></div>
                                    <div ref={text2Ref} className={`absolute left-0 -translate-x-20 border-2 transition-colors duration-300 ${isDark ? 'border-white text-white bg-black' : 'border-black text-black bg-white'
                                        } rounded-lg px-5 py-1.5 whitespace-nowrap`}>
                                        Mình có thể giúp gì cho bạn?
                                    </div>
                                </div>
                            </div>
                            <div className="absolute top-32">
                                <div className="flex items-center">
                                    <div ref={line3Ref} className={`w-16 h-0.5 -translate-x-16 transition-colors duration-300 ${isDark ? 'bg-white' : 'bg-black'
                                        }`}></div>
                                    <div ref={inputRef} className="absolute left-0 -translate-x-20">
                                        <input
                                            type="text"
                                            placeholder="Nhập câu hỏi của bạn..."
                                            className={`border-2 transition-colors duration-300 ${isDark ? 'border-white text-white bg-black placeholder-gray-400' : 'border-black text-black bg-white placeholder-gray-600'
                                                } rounded-lg px-5 py-1.5 w-72 focus:outline-none`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="absolute top-8">
                            <div className="flex items-center">
                                <div ref={line1Ref} className={`w-16 h-0.5 -translate-x-16 transition-colors duration-300 ${isDark ? 'bg-white' : 'bg-black'}`}></div>
                                <div ref={text1Ref} className={`absolute left-0 -translate-x-20 border-2 transition-colors duration-300 ${isDark
                                    ? 'border-white text-white bg-black'
                                    : 'border-black text-black bg-white'
                                    } rounded-lg px-5 py-1.5 whitespace-nowrap`}>
                                    Giới thiệu
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar; 