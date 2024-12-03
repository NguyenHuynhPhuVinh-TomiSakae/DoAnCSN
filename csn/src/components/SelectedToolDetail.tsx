/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from 'framer-motion';
import Image from 'next/image';
import { BackButton } from './BackButton';

interface SelectedToolDetailProps {
    selectedTool: any;
    onBack: () => void;
}

export function SelectedToolDetail({ selectedTool, onBack }: SelectedToolDetailProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start max-w-[800px] mx-auto"
        >
            <div className="w-full">
                <BackButton onClick={onBack} />
            </div>

            {/* Ảnh */}
            <div className="relative w-full h-[500px] mb-8">
                <Image
                    src={selectedTool.image || '/placeholder.jpg'}
                    alt={selectedTool.name}
                    fill
                    className="object-cover rounded-lg"
                />
            </div>

            {/* Tên và nút truy cập cùng dòng */}
            <div className="w-full flex justify-between items-center mb-12">
                <h3 className="text-4xl font-bold text-white">{selectedTool.name}</h3>
                <span className="relative inline-flex w-[180px] h-[55px] mx-[15px] [perspective:1000px]">
                    <a
                        href={selectedTool.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg tracking-wider [transform-style:preserve-3d] [transform:translateZ(-25px)] transition-transform duration-300 hover:[transform:translateZ(-25px)_rotateX(-90deg)]"
                    >
                        <span className="absolute w-[180px] h-[55px] flex items-center justify-center gap-2 border-[2px] border-white bg-transparent text-white rounded-[5px] [transform:rotateY(0deg)_translateZ(25px)] text-lg font-medium">
                            <span>Truy cập</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                            </svg>
                        </span>
                        <span className="absolute w-[180px] h-[55px] flex items-center justify-center gap-2 border-[2px] border-white bg-white text-black rounded-[5px] [transform:rotateX(90deg)_translateZ(25px)] text-lg font-medium">
                            <span>Truy cập</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                            </svg>
                        </span>
                    </a>
                </span>
            </div>

            {/* Mô tả */}
            <div className="w-full mb-16">
                <div className="space-y-6">
                    {selectedTool.description?.map((desc: string, index: number) => (
                        <p key={index} className="text-white text-lg leading-relaxed">
                            {desc}
                        </p>
                    ))}
                </div>
            </div>

            {/* Tính năng chính */}
            <div className="w-full">
                <h4 className="text-2xl font-medium text-white mb-6 border-b border-white/20 pb-4">
                    Tính năng chính
                </h4>
                <div className="grid grid-cols-1 gap-4 ml-8 relative">
                    <div
                        className="absolute left-0 w-[1px] bg-white/20"
                        style={{
                            top: '-24px',
                            height: 'calc(100% + 24px)'
                        }}
                    />
                    {selectedTool.keyFeatures?.map((feature: string, index: number) => (
                        <div
                            key={index}
                            className="pl-8 pb-4 border-b border-white/20 relative"
                        >
                            <div className="absolute left-0 top-1/2 w-6 h-[1px] bg-white/20" />
                            <p className="text-white text-lg">{feature}</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
} 