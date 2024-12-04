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
        setIsLoading(true);
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
                            placeholder={query || "Tìm kiếm công cụ AI..."}
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
                {isLoading ? (
                    <motion.div
                        className="w-12 h-12 bg-black mx-auto mt-32"
                        animate={{
                            rotate: 360,
                            scale: [1, 0.8, 1],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ) : (
                    <>
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
                                            <div className="flex justify-between items-center px-2">
                                                <h2 className="text-lg font-medium text-black">
                                                    {tool.name}
                                                </h2>
                                                <div className="flex items-center gap-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    <span>{tool.view}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
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
                    </>
                )}
            </div>
        </div>
    );
}