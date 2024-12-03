/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { motion } from 'framer-motion';
import { Be_Vietnam_Pro, Orbitron } from 'next/font/google';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useInView } from 'framer-motion';

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

// Tạo component con
function AISection({ tag, index, tagTranslations, allTools }: any) {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: true,
        amount: 0.2,
        margin: "0px 0px -100px 0px"
    });

    // Sử dụng state để lưu trữ currentPage và currentTools cho từng tag
    const [currentPage, setCurrentPage] = useState(0);
    const [currentTools, setCurrentTools] = useState(allTools.slice(0, 3));

    const handleNextTools = () => {
        const nextPage = currentPage + 1;
        const startIndex = nextPage * 3;
        const nextTools = allTools.slice(startIndex, startIndex + 3);

        if (nextTools.length === 0) {
            setCurrentTools(allTools.slice(0, 3));
            setCurrentPage(0);
        } else {
            setCurrentTools(nextTools);
            setCurrentPage(nextPage);
        }
    };

    const handlePrevTools = () => {
        if (currentPage > 0) {
            const prevPage = currentPage - 1;
            const startIndex = prevPage * 3;
            setCurrentTools(allTools.slice(startIndex, startIndex + 3));
            setCurrentPage(prevPage);
        } else {
            const lastPage = Math.floor((allTools.length - 1) / 3);
            const startIndex = lastPage * 3;
            setCurrentTools(allTools.slice(startIndex, startIndex + 3));
            setCurrentPage(lastPage);
        }
    };

    return (
        <motion.section
            key={tag}
            ref={ref}
            className={`mb-16 w-full ${index % 2 === 0 ? 'text-left' : 'text-right'}`}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h2
                className="text-2xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
            >
                {tagTranslations[tag] || tag}
            </motion.h2>
            <motion.div
                className={`grid grid-cols-4 gap-4 ${index % 2 === 0 ? '' : 'ml-auto'}`}
            >
                {index % 2 === 0 ? (
                    <>
                        {tag === 'Data' && <div className="invisible" />}
                        {currentTools.map((tool: any) => (
                            <div key={tool.id} className="flex flex-col">
                                <motion.div
                                    className="relative w-full overflow-hidden group"
                                    style={{ height: '200px' }}
                                    initial={{ height: 0 }}
                                    animate={isInView ? { height: 200 } : { height: 0 }}
                                    transition={{
                                        height: {
                                            duration: 0.5,
                                            delay: 0.5,
                                            ease: "easeOut"
                                        }
                                    }}
                                >
                                    <Image
                                        src={tool.image || '/placeholder.jpg'}
                                        alt={tool.name}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                </motion.div>
                                <motion.div
                                    className="text-white py-2 flex justify-between items-center"
                                    initial={{ scale: 0.5 }}
                                    animate={isInView ? { scale: 1 } : { scale: 0.5 }}
                                    transition={{
                                        scale: {
                                            duration: 0.5,
                                            delay: 0.5,
                                            ease: "easeOut"
                                        }
                                    }}
                                >
                                    <div className="font-medium">{tool.name}</div>
                                    <div className="flex items-center gap-4 text-sm text-white">
                                        <div className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </svg>
                                            {tool.view || 0}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                            </svg>
                                            {tool.heart || 0}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            {(tool.evaluation || 0).toFixed(1)}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                        <div
                            className="flex items-center justify-center group cursor-pointer transition-transform duration-300 hover:bg-white"
                            onClick={handleNextTools}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-32 h-32 text-white group-hover:text-black transform transition-all duration-500 ease-in-out group-hover:translate-x-4"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </>
                ) : (
                    <>
                        <div
                            className="flex items-center justify-center group cursor-pointer transition-transform duration-300 hover:bg-white"
                            onClick={handlePrevTools}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-32 h-32 text-white group-hover:text-black transform transition-all duration-500 ease-in-out group-hover:-translate-x-4"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </div>
                        {currentTools.map((tool: any) => (
                            <div key={tool.id} className="flex flex-col">
                                <motion.div
                                    className="relative w-full overflow-hidden group"
                                    style={{ height: '200px' }}
                                    initial={{ height: 0 }}
                                    animate={isInView ? { height: 200 } : { height: 0 }}
                                    transition={{
                                        height: {
                                            duration: 0.5,
                                            delay: 0.5,
                                            ease: "easeOut"
                                        }
                                    }}
                                >
                                    <Image
                                        src={tool.image || '/placeholder.jpg'}
                                        alt={tool.name}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                </motion.div>
                                <motion.div
                                    className="text-white py-2 flex justify-between items-center"
                                    initial={{ scale: 0.5 }}
                                    animate={isInView ? { scale: 1 } : { scale: 0.5 }}
                                    transition={{
                                        scale: {
                                            duration: 0.5,
                                            delay: 0.5,
                                            ease: "easeOut"
                                        }
                                    }}
                                >
                                    <div className="font-medium">{tool.name}</div>
                                    <div className="flex items-center gap-4 text-sm text-white">
                                        <div className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </svg>
                                            {tool.view || 0}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                            </svg>
                                            {tool.heart || 0}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            {(tool.evaluation || 0).toFixed(1)}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </>
                )}
            </motion.div>
        </motion.section>
    );
}

export default function ShowAIIntro() {
    const [aiToolsByTag, setAiToolsByTag] = useState<{ [key: string]: any[] }>({});
    const [allToolsByTag, setAllToolsByTag] = useState<{ [key: string]: any[] }>({});

    // Thêm object ánh xạ tag sang tiếng Việt
    const tagTranslations: { [key: string]: string } = {
        'Video': 'Tạo video',
        'Code': 'Hỗ trợ lập trình',
        'Image': 'Tạo hình ảnh',
        'Web': 'Công cụ Web',
        'Data': 'Xử lý dữ liệu',
        'Chat': 'Trò chuyện AI',
        'App': 'Ứng dụng AI',
    };

    // Thêm ref và useInView cho phần mô tả
    const descriptionRef = useRef(null);
    const isDescriptionInView = useInView(descriptionRef, { once: true });

    useEffect(() => {
        fetch('/api/showai?sort=view')
            .then(res => res.json())
            .then(data => {
                const groupedByTag = data.data.reduce((acc: { [key: string]: any[] }, tool: any) => {
                    tool.tags?.forEach((tag: string) => {
                        if (!acc[tag]) {
                            acc[tag] = [];
                        }
                        acc[tag].push(tool);
                    });
                    return acc;
                }, {});

                // Lưu tất cả công cụ đã được sắp xếp
                const sortedByTag = Object.keys(groupedByTag).reduce((acc: { [key: string]: any[] }, tag: string) => {
                    acc[tag] = groupedByTag[tag].sort((a: any, b: any) => b.view - a.view);
                    return acc;
                }, {});

                setAllToolsByTag(sortedByTag);

                // Chỉ hiển thị 3 công cụ đầu tiên
                const topThreeByTag = Object.keys(groupedByTag).reduce((acc: { [key: string]: any[] }, tag: string) => {
                    acc[tag] = sortedByTag[tag].slice(0, 3);
                    return acc;
                }, {});

                setAiToolsByTag(topThreeByTag);
            })
            .catch(err => console.error('Lỗi khi tải dữ liệu:', err));
    }, []);

    return (
        <motion.div
            className={`min-h-full bg-black text-white ${beVietnamPro.className} relative`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <div className="absolute inset-0 bg-black fixed" />

            <div className="relative z-10 py-24">
                <motion.div
                    ref={descriptionRef}
                    className="text-center mb-24 px-8"
                    initial={{ y: 50, opacity: 0 }}
                    animate={isDescriptionInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <h1 className={`${orbitron.className} text-6xl font-bold mb-8 tracking-wider`}>
                        Khám Phá Công Nghệ AI
                    </h1>
                    <p className="text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed font-medium">
                        Tổng hợp những công cụ AI hàng đầu được cộng đồng sử dụng nhiều nhất,
                        giúp bạn nâng cao hiệu suất công việc trong từng lĩnh vực.
                    </p>
                </motion.div>

                <div className="flex flex-wrap justify-between px-8">
                    {Object.entries(aiToolsByTag).map(([tag], index) => (
                        <AISection
                            key={tag}
                            tag={tag}
                            index={index}
                            tagTranslations={tagTranslations}
                            allTools={allToolsByTag[tag] || []}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
} 