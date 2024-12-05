'use client';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useInView } from 'framer-motion';
import { Be_Vietnam_Pro, Orbitron } from 'next/font/google';
import Footer from './Footer';
import { SelectedToolDetail } from './SelectedToolDetail';
import anime from 'animejs';

const beVietnamPro = Be_Vietnam_Pro({
    subsets: ['vietnamese'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
});

const orbitron = Orbitron({
    subsets: ['latin'],
    weight: ['700'],
    display: 'swap',
});

interface Tool {
    id: string;
    name: string;
    image: string;
    description: string;
    createdAt: string;
}

export default function NewAITools() {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        amount: 0.2,
        margin: "0px 0px -100px 0px",
        once: true
    });

    const [allTools, setAllTools] = useState<Tool[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 4;
    const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
    const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

    const indexOfLastTool = currentPage * limit;
    const indexOfFirstTool = indexOfLastTool - limit;
    const currentTools = allTools.slice(indexOfFirstTool, indexOfLastTool);
    const totalPages = Math.ceil(allTools.length / limit);

    useEffect(() => {
        fetch('/api/showai')
            .then(res => res.json())
            .then(data => {
                console.log('NewAITools data:', data);
                if (Array.isArray(data.data)) {
                    setAllTools(data.data);
                }
            })
            .catch(err => console.error('Lỗi khi tải dữ liệu công cụ AI mới:', err));
    }, []);

    const nextSlide = () => {
        setSlideDirection('left');
        setCurrentPage(p => Math.min(totalPages, p + 1));
    };

    const prevSlide = () => {
        setSlideDirection('right');
        setCurrentPage(p => Math.max(1, p - 1));
    };

    const handleToolClick = (tool: Tool) => {
        const imageElement = document.querySelector(`[data-newtool-id="${tool.id}"]`);
        const targetElement = document.querySelector('#new-tools-selected-container');
        const mainContent = document.querySelector('#new-tools-main-content');

        if (imageElement && targetElement && mainContent) {
            anime({
                targets: mainContent,
                opacity: [1, 0],
                translateY: [0, 50],
                duration: 500,
                easing: 'easeOutExpo',
                complete: () => {
                    setSelectedTool(tool);
                    window.scrollTo({
                        top: targetElement.getBoundingClientRect().top + window.pageYOffset - 100,
                        behavior: 'smooth'
                    });
                    anime({
                        targets: targetElement,
                        opacity: [0, 1],
                        translateY: [50, 0],
                        duration: 500,
                        easing: 'easeOutExpo'
                    });
                }
            });
        }
    };

    const handleBack = () => {
        const targetElement = document.querySelector('#new-tools-selected-container');
        const mainContent = document.querySelector('#new-tools-main-content');

        if (targetElement && mainContent) {
            anime({
                targets: targetElement,
                opacity: [1, 0],
                translateY: [0, 50],
                duration: 500,
                easing: 'easeOutExpo',
                complete: () => {
                    setSelectedTool(null);
                    setTimeout(() => {
                        anime({
                            targets: mainContent,
                            opacity: [0, 1],
                            translateY: [50, 0],
                            duration: 500,
                            easing: 'easeOutExpo'
                        });
                    }, 100);
                }
            });
        }
    };

    return (
        <div id="new-ai-tools" className={`bg-black text-white pt-32 ${beVietnamPro.className}`}>
            <motion.div ref={ref} className="container mx-auto px-8 md:px-16 max-w-7xl">
                <motion.div
                    className="text-center mb-24"
                    initial={{ y: 50, opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <h2 className={`${orbitron.className} text-6xl font-bold mb-8 tracking-wider`}>
                        Công Cụ AI Mới Nhất
                    </h2>
                    <p className="text-2xl text-white max-w-4xl mx-auto leading-relaxed font-medium">
                        Khám phá những công cụ AI mới nhất được cập nhật liên tục,
                        giúp bạn luôn đi đầu với xu hướng công nghệ.
                    </p>
                </motion.div>

                <div id="new-tools-selected-container">
                    {selectedTool && (
                        <SelectedToolDetail
                            selectedTool={selectedTool}
                            onBack={handleBack}
                            theme="dark"
                        />
                    )}
                </div>

                <div id="new-tools-main-content" style={{ display: selectedTool ? 'none' : 'block' }}>
                    <div className="relative h-[300px]">
                        {currentTools.map((tool, index) => (
                            <motion.div
                                key={tool.id}
                                data-newtool-id={tool.id}
                                className="absolute w-full lg:w-1/4 px-4 cursor-pointer"
                                onClick={() => handleToolClick(tool)}
                                initial={{
                                    x: slideDirection === 'right' ? '300%' : '0',
                                    y: 0,
                                    zIndex: 10 - index
                                }}
                                animate={isInView ? {
                                    x: `${index * 100}%`,
                                    y: 0,
                                    transition: {
                                        duration: slideDirection === 'right' ? 0.8 : 0.4,
                                        delay: index * 0.2,
                                        ease: "easeOut"
                                    }
                                } : {}}
                            >
                                <div className="overflow-hidden mx-2">
                                    <div className="relative h-56 rounded-xl overflow-hidden">
                                        <Image
                                            src={tool.image}
                                            alt={tool.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <motion.h3
                                        className="text-xl font-semibold text-white text-center mt-6"
                                        initial={{ opacity: 0 }}
                                        animate={isInView ? {
                                            opacity: 1,
                                            transition: {
                                                duration: 0.3,
                                                delay: 1.6 // Đợi animation chính hoàn thành (0.8s + 0.2s * 4)
                                            }
                                        } : {}}
                                    >
                                        {tool.name}
                                    </motion.h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-2 mb-16 gap-20">
                        <div
                            className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center cursor-pointer 
                            hover:bg-white group border-2 border-white rounded-lg transition-all duration-300 
                            ${currentPage === 1 ? 'opacity-50' : ''}`}
                            onClick={() => currentPage !== 1 && prevSlide()}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-8 h-8 text-white group-hover:text-black"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </div>

                        <div
                            className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center cursor-pointer 
                            hover:bg-white group border-2 border-white rounded-lg transition-all duration-300 
                            ${currentPage === totalPages ? 'opacity-50' : ''}`}
                            onClick={() => currentPage !== totalPages && nextSlide()}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-8 h-8 text-white group-hover:text-black"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </motion.div>
            <Footer />
        </div>
    );
} 