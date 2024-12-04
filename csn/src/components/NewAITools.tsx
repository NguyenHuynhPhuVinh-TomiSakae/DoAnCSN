'use client';
import { motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useInView } from 'framer-motion';
import { Be_Vietnam_Pro, Orbitron } from 'next/font/google';
import Footer from './Footer';

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

    const [tools, setTools] = useState<Tool[]>([]);

    useEffect(() => {
        fetch('/api/showai?limit=6')
            .then(res => res.json())
            .then(data => {
                console.log('NewAITools data:', data);
                if (Array.isArray(data.data)) {
                    setTools(data.data);
                }
            })
            .catch(err => console.error('Lỗi khi tải dữ liệu công cụ AI mới:', err));
    }, []);

    return (
        <div id="new-ai-tools" className={`bg-black text-white pt-24 ${beVietnamPro.className}`}>
            <motion.div
                ref={ref}
                className="container mx-auto px-8"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="text-center mb-16"
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool) => (
                        <motion.div
                            key={tool.id}
                            className="bg-zinc-900 rounded-lg overflow-hidden hover:shadow-lg transition-shadow border border-zinc-800"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="relative h-48">
                                <Image
                                    src={tool.image}
                                    alt={tool.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-semibold mb-2 text-white">{tool.name}</h3>
                                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                                    {tool.description}
                                </p>
                                <div className="flex justify-between items-center text-sm text-gray-300">
                                    <span>Mới thêm: {new Date(tool.createdAt).toLocaleDateString('vi-VN')}</span>
                                    <button className="bg-zinc-800 text-white px-4 py-2 rounded hover:bg-zinc-700 transition-colors">
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
            <Footer />
        </div>
    );
} 