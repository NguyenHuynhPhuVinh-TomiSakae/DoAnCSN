'use client';
import { motion } from 'framer-motion';
import { Be_Vietnam_Pro, Orbitron } from 'next/font/google';
import { FaRobot } from "react-icons/fa";

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
    return (
        <motion.div
            className={`h-screen bg-black text-white ${beVietnamPro.className} relative overflow-hidden`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-black" />

            {/* Content Container */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
                {/* Logo Section */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="flex items-center gap-4 mb-8"
                >
                    <FaRobot className="w-16 h-16 text-white" />
                    <h1 className={`${orbitron.className} text-6xl md:text-8xl text-white`}>
                        SHOWAI
                    </h1>
                </motion.div>

                {/* Description */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-center max-w-3xl"
                >
                    <p className="text-xl md:text-2xl mb-6 text-white">
                        Khám phá sức mạnh của AI trong tầm tay bạn
                    </p>
                    <p className="text-base md:text-lg text-white leading-relaxed">
                        SHOWAI là nền tảng tổng hợp các công cụ AI hàng đầu, giúp bạn dễ dàng
                        tiếp cận và sử dụng công nghệ AI trong công việc và cuộc sống hàng ngày.
                    </p>
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
                >
                    {[
                        { title: 'Đa dạng công cụ', desc: 'Hơn 100+ công cụ AI được tuyển chọn' },
                        { title: 'Dễ dàng sử dụng', desc: 'Giao diện thân thiện, hướng dẫn chi tiết' },
                        { title: 'Cập nhật liên tục', desc: 'Luôn cập nhật các công cụ AI mới nhất' },
                    ].map((feature, index) => (
                        <div key={index} className="text-center px-4">
                            <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                            <p className="text-white">{feature.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </motion.div>
    );
} 