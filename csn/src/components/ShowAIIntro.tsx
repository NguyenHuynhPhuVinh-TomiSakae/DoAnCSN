/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { motion } from 'framer-motion';
import { Be_Vietnam_Pro, Orbitron } from 'next/font/google';
import { useEffect, useState } from 'react';
import Image from 'next/image';

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

export default function ShowAIIntro() {
    const [aiToolsByTag, setAiToolsByTag] = useState<{ [key: string]: any[] }>({});

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

    useEffect(() => {
        fetch('/api/showai?sort=view')
            .then(res => res.json())
            .then(data => {
                // Đầu tiên nhóm tất cả công cụ theo tag
                const groupedByTag = data.data.reduce((acc: { [key: string]: any[] }, tool: any) => {
                    tool.tags?.forEach((tag: string) => {
                        if (!acc[tag]) {
                            acc[tag] = [];
                        }
                        acc[tag].push(tool);
                    });
                    return acc;
                }, {});

                // Sau đó lấy top 3 của mỗi tag
                const topThreeByTag = Object.keys(groupedByTag).reduce((acc: { [key: string]: any[] }, tag: string) => {
                    acc[tag] = groupedByTag[tag]
                        .sort((a: any, b: any) => b.view - a.view)
                        .slice(0, 3);
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

            <div className="relative z-10 py-16">
                <motion.div
                    className="text-center mb-16 px-4"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className={`${orbitron.className} text-4xl font-bold mb-4`}>
                        Khám Phá Công Nghệ AI
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                        Tổng hợp những công cụ AI hàng đầu được cộng đồng sử dụng nhiều nhất,
                        giúp bạn nâng cao hiệu suất công việc trong từng lĩnh vực.
                    </p>
                </motion.div>

                <div className="flex flex-wrap justify-between px-8">
                    {Object.entries(aiToolsByTag).map(([tag, tools], index) => (
                        <motion.section
                            key={tag}
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="mb-16 w-1/2"
                        >
                            <h2 className={`text-2xl font-bold mb-6 ${orbitron.className} ${index % 2 === 0 ? '' : 'text-right'}`}>
                                {tagTranslations[tag] || tag}
                            </h2>
                            <div className={`grid grid-cols-1 gap-4 w-48 ${index % 2 === 0 ? '' : 'ml-auto'}`}>
                                {tools.map((tool: any) => (
                                    <div key={tool.id} className="relative aspect-[16/9] overflow-hidden group">
                                        <Image
                                            src={tool.image || '/placeholder.jpg'}
                                            alt={tool.name}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                ))}
                            </div>
                        </motion.section>
                    ))}
                </div>
            </div>
        </motion.div>
    );
} 