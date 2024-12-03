'use client';
import { useEffect, useState } from 'react';
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
    const [viewTools, setViewTools] = useState<Tool[]>([]);
    const [heartTools, setHeartTools] = useState<Tool[]>([]);
    const [evaluationTools, setEvaluationTools] = useState<Tool[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [viewResponse, heartResponse, evaluationResponse] = await Promise.all([
                    fetch('/api/showai?sort=view&limit=9'),
                    fetch('/api/showai?sort=heart&limit=9'),
                    fetch('/api/showai?sort=evaluation&limit=9')
                ]);

                const viewData = await viewResponse.json();
                const heartData = await heartResponse.json();
                const evaluationData = await evaluationResponse.json();

                setViewTools(viewData.data);
                setHeartTools(heartData.data);
                setEvaluationTools(evaluationData.data);
                setIsLoading(false);
            } catch (err) {
                console.error('Lỗi khi tải dữ liệu:', err);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div id="ai-ranking" className={`min-h-screen bg-white text-black ${beVietnamPro.className} mt-12`}>
            <div className="h-full py-24 px-8">
                <div className="text-center mb-24">
                    <h1 className={`${orbitron.className} text-6xl font-bold mb-8 tracking-wider text-black`}>
                        Top Công Cụ AI
                    </h1>
                    <p className="text-2xl text-black max-w-4xl mx-auto leading-relaxed font-medium">
                        Khám phá những công cụ AI được yêu thích nhất dựa trên lượt xem, đánh giá và tương tác từ cộng đồng người dùng.
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center">Đang tải...</div>
                ) : (
                    <div className="grid grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {/* Cột Lượt xem */}
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold text-center mb-6 pb-2 border-b-2 border-black">
                                <div className="flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                    Lượt xem cao nhất
                                </div>
                            </h2>
                            {viewTools.map((tool, index) => (
                                <div key={`view-${tool.id}`} className="flex flex-col items-center mb-6">
                                    <div className={`${orbitron.className} text-xl font-bold mb-2`}>
                                        #{index + 1}
                                    </div>
                                    <div className="relative w-32 h-32 mb-2">
                                        <Image
                                            src={tool.image || '/placeholder.jpg'}
                                            alt={tool.name}
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold">{tool.name}</div>
                                        <div className="flex items-center justify-center gap-2 text-gray-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </svg>
                                            {tool.view.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cột Yêu thích */}
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold text-center mb-6 pb-2 border-b-2 border-black">
                                <div className="flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                    </svg>
                                    Yêu thích nhiều nhất
                                </div>
                            </h2>
                            {heartTools.map((tool, index) => (
                                <div key={`heart-${tool.id}`} className="flex flex-col items-center mb-6">
                                    <div className={`${orbitron.className} text-xl font-bold mb-2`}>
                                        #{index + 1}
                                    </div>
                                    <div className="relative w-32 h-32 mb-2">
                                        <Image
                                            src={tool.image || '/placeholder.jpg'}
                                            alt={tool.name}
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold">{tool.name}</div>
                                        <div className="flex items-center justify-center gap-2 text-gray-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                            </svg>
                                            {tool.heart.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Cột Đánh giá */}
                        <div className="flex flex-col">
                            <h2 className="text-2xl font-bold text-center mb-6 pb-2 border-b-2 border-black">
                                <div className="flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    Đánh giá cao nhất
                                </div>
                            </h2>
                            {evaluationTools.map((tool, index) => (
                                <div key={`eval-${tool.id}`} className="flex flex-col items-center mb-6">
                                    <div className={`${orbitron.className} text-xl font-bold mb-2`}>
                                        #{index + 1}
                                    </div>
                                    <div className="relative w-32 h-32 mb-2">
                                        <Image
                                            src={tool.image || '/placeholder.jpg'}
                                            alt={tool.name}
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <div className="font-bold">{tool.name}</div>
                                        <div className="flex items-center justify-center gap-2 text-gray-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            {tool.evaluation.toFixed(1)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
} 