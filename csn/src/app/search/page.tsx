'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Be_Vietnam_Pro } from 'next/font/google';
import { SelectedToolDetail } from '@/components/SelectedToolDetail';
import anime from 'animejs';

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
    view: number;
    heart: number;
    evaluation: number;
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [tools, setTools] = useState<Tool[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchValue, setSearchValue] = useState('');
    const [selectedTool, setSelectedTool] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;

            try {
                const response = await fetch(`/api/showai?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                const sortedTools = data.data.sort((a: Tool, b: Tool) => b.view - a.view);
                setTools(sortedTools);
            } catch (error) {
                console.error('Lỗi khi tìm kiếm:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    useEffect(() => {
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
            searchInput.focus();
        }
    }, []);

    const handleSearch = () => {
        if (!searchValue.trim()) return;
        router.push(`/search?q=${encodeURIComponent(searchValue)}`);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleToolClick = (tool: Tool) => {
        const imageElement = document.querySelector(`[data-tool-id="${tool.id}"]`);
        const targetElement = document.querySelector('#search-selected-tool-container');
        const mainContent = document.querySelector('#search-main-content');

        if (imageElement && targetElement && mainContent) {
            anime({
                targets: mainContent,
                opacity: [1, 0],
                translateY: [0, 50],
                duration: 500,
                easing: 'easeOutExpo',
                complete: () => {
                    setSelectedTool(tool.id);
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
        const targetElement = document.querySelector('#search-selected-tool-container');
        const mainContent = document.querySelector('#search-main-content');

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
        <div className={`min-h-screen bg-white ${beVietnamPro.className}`}>
            <div className="mx-auto mt-24 w-full max-w-2xl">
                <motion.div
                    className="h-[5em] border-2 border-black rounded-full overflow-hidden flex items-center relative bg-white"
                    initial={{ width: '5em' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <div className="w-full px-8 flex items-center justify-center">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Tìm kiếm công cụ AI..."
                            className="w-full bg-transparent text-3xl font-medium outline-none placeholder:text-black"
                            autoFocus
                        />
                        <div
                            className="search-icon ml-auto cursor-pointer"
                            onClick={handleSearch}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-8 h-8"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 mt-8">
                <div id="search-selected-tool-container">
                    {selectedTool && (
                        <div className="pl-12">
                            {tools.map(tool => {
                                if (tool.id === selectedTool) {
                                    return (
                                        <SelectedToolDetail
                                            key={tool.id}
                                            selectedTool={tool}
                                            onBack={handleBack}
                                            theme="light"
                                        />
                                    );
                                }
                                return null;
                            })}
                        </div>
                    )}
                </div>

                <div id="search-main-content" style={{ display: selectedTool ? 'none' : 'block' }}>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {tools.map((tool) => (
                                <motion.div
                                    key={tool.id}
                                    data-tool-id={tool.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl overflow-hidden cursor-pointer"
                                    onClick={() => handleToolClick(tool)}
                                >
                                    <div className="relative h-48">
                                        <Image
                                            src={tool.image || '/placeholder.jpg'}
                                            alt={tool.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-3">
                                        <h2 className="text-lg font-medium text-center text-black mb-3">
                                            {tool.name}
                                        </h2>
                                        <div className="flex justify-between items-center px-2 text-sm ">
                                            <div className="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                <span>{tool.view}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                                <span>{tool.heart}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                </svg>
                                                <span>{Math.round(tool.evaluation)}</span>
                                            </div>
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
                            <p className="">
                                Vui lòng thử lại với từ khóa khác
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}