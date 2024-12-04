'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Be_Vietnam_Pro } from 'next/font/google';
import Link from 'next/link';

const beVietnamPro = Be_Vietnam_Pro({
    subsets: ['vietnamese'],
    weight: ['400', '500', '600', '700'],
    display: 'swap',
});

interface Tool {
    id: string;
    name: string;
    image: string;
    description: string[];
    keyFeatures: string[];
    link: string;
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [tools, setTools] = useState<Tool[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;

            try {
                const response = await fetch(`/api/showai?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                setTools(data.data);
            } catch (error) {
                console.error('Lỗi khi tìm kiếm:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    return (
        <div className={`min-h-screen bg-white ${beVietnamPro.className}`}>
            <div className="max-w-7xl mx-auto px-4 py-8 mt-24">
                {/* Results */}
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tools.map((tool) => (
                            <motion.div
                                key={tool.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white border-2 border-black rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="relative h-48">
                                    <Image
                                        src={tool.image || '/placeholder.jpg'}
                                        alt={tool.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-black mb-3">{tool.name}</h2>
                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                        {tool.description[0]}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <Link
                                            href={`/?tool=${tool.id}`}
                                            className="text-black hover:text-gray-600 transition-colors"
                                        >
                                            Xem chi tiết
                                        </Link>
                                        <a
                                            href={tool.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                                        >
                                            Truy cập
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* No results */}
                {!isLoading && tools.length === 0 && (
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold text-black mb-4">
                            Không tìm thấy kết quả nào
                        </h2>
                        <p className="text-gray-600">
                            Vui lòng thử lại với từ khóa khác
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}