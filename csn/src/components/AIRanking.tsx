'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Be_Vietnam_Pro, Orbitron } from 'next/font/google';
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

interface Tool {
    id: string;
    name: string;
    image: string;
    view: number;
    heart: number;
    evaluation: number;
    description: string;
}

export default function AIRanking() {
    const [tools, setTools] = useState<Tool[]>([]);
    const [sortBy, setSortBy] = useState<'view' | 'heart' | 'evaluation'>('view');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/showai')
            .then(res => res.json())
            .then(data => {
                setTools(data.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Lỗi khi tải dữ liệu:', err);
                setIsLoading(false);
            });
    }, []);

    const sortedTools = [...tools].sort((a, b) => b[sortBy] - a[sortBy]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div id="ai-ranking" className={`min-h-screen bg-white text-black ${beVietnamPro.className} mt-12`}>
            <div className="h-full py-24 px-8">
                <div className="text-center mb-24">
                    <h1 className={`${orbitron.className} text-6xl font-bold mb-8 tracking-wider text-black`}>
                        Top Công Cụ AI
                    </h1>
                    <p className="text-2xl text-black max-w-4xl mx-auto leading-relaxed font-medium">
                        Khám phá những công cụ AI thịnh hành và được tin dùng nhất.
                        Theo dõi xu hướng và đánh giá từ cộng đồng người dùng.
                    </p>
                </div>

                {/* Nút sắp xếp */}
                <div className="flex justify-center gap-4 mb-8">
                    <button
                        onClick={() => setSortBy('view')}
                        className={`px-6 py-2 rounded-full border-2 border-black transition-all
                            ${sortBy === 'view' ? 'bg-black text-white' : 'hover:bg-black hover:text-white'}`}
                    >
                        Lượt xem
                    </button>
                    <button
                        onClick={() => setSortBy('heart')}
                        className={`px-6 py-2 rounded-full border-2 border-black transition-all
                            ${sortBy === 'heart' ? 'bg-black text-white' : 'hover:bg-black hover:text-white'}`}
                    >
                        Yêu thích
                    </button>
                    <button
                        onClick={() => setSortBy('evaluation')}
                        className={`px-6 py-2 rounded-full border-2 border-black transition-all
                            ${sortBy === 'evaluation' ? 'bg-black text-white' : 'hover:bg-black hover:text-white'}`}
                    >
                        Đánh giá
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-center">Đang tải...</div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="max-w-4xl mx-auto"
                    >
                        {sortedTools.map((tool, index) => (
                            <motion.div
                                key={tool.id}
                                variants={itemVariants}
                                className="flex items-center gap-6 mb-6 p-4 border-2 border-black rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                {/* Thứ hạng */}
                                <div className={`${orbitron.className} text-3xl font-bold w-12 text-center`}>
                                    #{index + 1}
                                </div>

                                {/* Ảnh */}
                                <div className="relative w-24 h-24 overflow-hidden rounded-lg">
                                    <Image
                                        src={tool.image || '/placeholder.jpg'}
                                        alt={tool.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Thông tin */}
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
                                    <p className="text-gray-600 line-clamp-2">{tool.description}</p>
                                </div>

                                {/* Chỉ số */}
                                <div className="flex gap-6 text-sm">
                                    <div className="flex flex-col items-center">
                                        <div className="font-bold text-lg">{tool.view.toLocaleString()}</div>
                                        <div className="text-gray-600">Lượt xem</div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="font-bold text-lg">{tool.heart.toLocaleString()}</div>
                                        <div className="text-gray-600">Yêu thích</div>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="font-bold text-lg">{tool.evaluation.toFixed(1)}</div>
                                        <div className="text-gray-600">Đánh giá</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
} 