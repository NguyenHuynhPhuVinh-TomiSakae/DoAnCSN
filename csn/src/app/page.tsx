/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaRobot } from "react-icons/fa";

interface LoadingProps {
  onLoadComplete: () => void;
}

// Tạo component với SSR disabled
const Loading = dynamic(() => Promise.resolve(({ onLoadComplete }: LoadingProps) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [targetProgress, setTargetProgress] = useState(0);

  useEffect(() => {
    let animationFrame: number;

    const animateProgress = () => {
      if (currentProgress < targetProgress) {
        setCurrentProgress(prev => {
          const next = Math.min(prev + 0.2, targetProgress);
          if (next < targetProgress) {
            setTimeout(() => {
              animationFrame = requestAnimationFrame(animateProgress);
            }, 100);
          }
          return next;
        });
      }
    };

    animationFrame = requestAnimationFrame(animateProgress);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [targetProgress, currentProgress]);

  useEffect(() => {
    // Hàm tải trước dữ liệu API
    const prefetchAPI = async () => {
      try {
        const response = await fetch('/api/showai');
        const data = await response.json();

        const imagePromises = data.data.map((item: { image: string }) => {
          return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            const timeout = setTimeout(() => {
              reject(new Error('Timeout loading image'));
            }, 10000);

            img.onload = () => {
              clearTimeout(timeout);
              resolve(img);
            };

            img.onerror = (e) => {
              clearTimeout(timeout);
              reject(new Error(`Failed to load image: ${item.image}`));
            };

            img.src = item.image;
          });
        });

        // Theo dõi tiến độ tải với xử lý lỗi và delay
        let loaded = 0;
        const total = imagePromises.length;

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        await Promise.all(
          imagePromises.map(async (promise: Promise<HTMLImageElement>) => {
            try {
              await promise;
              loaded++;
              await delay(800);
              setTargetProgress(Math.floor((loaded / total) * 100));
            } catch (error: unknown) {
              if (error instanceof Error) {
                console.warn('Lỗi khi tải ảnh:', error.message);
              } else {
                console.warn('Lỗi khi tải ảnh:', String(error));
              }
              loaded++;
              await delay(800);
              setTargetProgress(Math.floor((loaded / total) * 100));
            }
          })
        );

        // Hoàn thành tải
        await new Promise(resolve => setTimeout(resolve, 1000)); // Dừng 1 giây sau khi đạt 100%
        onLoadComplete();
      } catch (error) {
        console.error('Lỗi khi tải trước dữ liệu:', error);
        onLoadComplete();
      }
    };

    prefetchAPI();
  }, [onLoadComplete]);

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="text-center flex flex-col items-center gap-8">
        {/* Thanh tìm kiếm */}
        <motion.div
          className="w-[50em] h-[5em] mb-4 mx-auto border-2 border-black rounded-full overflow-hidden flex items-center relative"
          layoutId="searchBar"
        >
          {/* Text ở giữa */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            layoutId="searchText"
          >
            <motion.span
              className="relative z-10 font-medium text-3xl"
              initial={{ opacity: 1 }}
              animate={{ opacity: currentProgress === 100 ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span>
                ĐANG TẢI ... {Math.floor(currentProgress)}%
              </motion.span>
            </motion.span>
          </motion.div>

          {/* Icon tìm kiếm bên phải */}
          {currentProgress === 100 && (
            <motion.div
              className="ml-auto pr-6"
              layoutId="searchIcon"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-8 h-8"
                initial={{ rotate: 0 }}
                animate={{
                  rotate: currentProgress === 100 ? 0 : 360,
                  scale: currentProgress === 100 ? 1.2 : 1
                }}
                transition={{
                  rotate: {
                    duration: 2,
                    repeat: currentProgress === 100 ? 0 : Infinity,
                    ease: "linear"
                  },
                  scale: {
                    duration: 0.3
                  }
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </motion.svg>
            </motion.div>
          )}
        </motion.div>

        {/* Icon AI bên dưới */}
        <motion.div
          className="absolute left-32 bottom-32"
          animate={{
            x: `calc((100vw - 24rem) * ${currentProgress / 100})`,
          }}
          transition={{
            duration: 0.3,
            ease: "linear"
          }}
        >
          <FaRobot className="w-32 h-32" />
          <motion.div
            className="absolute bottom-0 left-0 w-32 h-1 bg-black"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}), { ssr: false });

// Wrapper component
export default function LoadingWrapper(props: LoadingProps) {
  return <Loading {...props} />;
}
