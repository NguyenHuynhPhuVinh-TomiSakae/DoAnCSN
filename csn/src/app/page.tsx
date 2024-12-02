/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState, useRef } from 'react';
import { FaRobot } from "react-icons/fa";
import gsap from 'gsap';

interface LoadingProps {
  onLoadComplete: () => void;
}

// Tạo component với SSR disabled
const Loading = dynamic(() => Promise.resolve(({ onLoadComplete }: LoadingProps) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const progressRef = useRef(0);

  // Hàm để animate tiến trình
  const animateProgress = (targetProgress: number) => {
    gsap.to(progressRef, {
      current: targetProgress,
      duration: 0.8, // Thời gian animation dài hơn
      ease: 'power1.out', // Easing function mượt hơn
      onUpdate: () => {
        setCurrentProgress(Math.floor(progressRef.current));
      }
    });
  };

  useEffect(() => {
    // Ẩn tất cả các phần tử ban đầu
    gsap.set('.search-icon', { opacity: 0 });
    gsap.set('.progress-bar', {
      width: '5em',  // Chiều rộng ban đầu nhỏ
      opacity: 1
    });
    gsap.set('.loading-text', { opacity: 0 });
    gsap.set('.progress-inner', { opacity: 0 });
    gsap.set('.ai-icon', { y: 50, opacity: 0, left: '8rem' }); // Ẩn icon AI và đặt vị trí ban đầu
    gsap.set('.ai-icon-target', { opacity: 0.3 }); // Thêm độ trong suốt cho vị trí đích

    // Tạo timeline cho animation mở rộng
    const tl = gsap.timeline({
      onComplete: () => {
        // Hiện loading text và progress sau khi mở rộng
        gsap.to(['.loading-text', '.progress-inner'], {
          opacity: 1,
          duration: 0.5,
          onComplete: () => {
            // Bắt đầu tải sau khi hiện text
            prefetchAPI();
          }
        });
      }
    });

    // Animation mở rộng và icon AI
    tl.to('.progress-bar', {
      width: '50em',
      duration: 1,
      ease: 'power2.out'
    })
      .to('.ai-icon', { // Thêm animation cho icon AI
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power2.out'
      }, '<'); // Chạy đồng thời với animation mở rộng

    // Tách hàm prefetchAPI ra khỏi useEffect
    const prefetchAPI = async () => {
      try {
        const response = await fetch('/api/showai');
        const data = await response.json();

        const imagePromises = data.data.map((item: { image: string }) => {
          return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${item.image}`));
            img.src = item.image;
          });
        });

        let loaded = 0;
        const total = imagePromises.length;

        await Promise.all(
          imagePromises.map(async (promise: Promise<HTMLImageElement>) => {
            try {
              await promise;
              loaded++;
              animateProgress((loaded / total) * 100);
            } catch (error) {
              loaded++;
              animateProgress((loaded / total) * 100);
            }
          })
        );

        // Đảm bảo tiến trình đạt 100% trước khi hoàn thành
        gsap.to(progressRef, {
          current: 100,
          duration: 0.8,
          ease: 'power1.out',
          onUpdate: () => {
            setCurrentProgress(Math.floor(progressRef.current));
          },
          onComplete: () => {
            onLoadComplete();
          }
        });

      } catch (error) {
        console.error('Lỗi khi tải trước dữ liệu:', error);
        onLoadComplete();
      }
    };
  }, [onLoadComplete]);

  useEffect(() => {
    if (currentProgress === 100) {
      gsap.set('.search-icon', { opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          // Có thể thêm callback nếu cần
        }
      });

      tl.to({}, { duration: 0.6 })
        .to('.loading-text', {
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out'
        })
        .to('.progress-inner', {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.out'
        }, '<') // Chạy cùng lúc với animation ẩn loading-text
        .to('.search-icon', {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.inOut'
        }, '-=0.8'); // Bắt đầu animation hiện search-icon trước khi loading-text ẩn hoàn toàn 0.3s
    }
  }, [currentProgress]);

  useEffect(() => {
    const aiIconElement = document.querySelector('.ai-icon');
    const targetElement = document.querySelector('.ai-icon-target');
    if (aiIconElement && targetElement) {
      const aiIconRect = aiIconElement.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      const startLeft = aiIconRect.left; // Vị trí gốc của AI icon
      const endLeft = targetRect.left; // Vị trí đích của AI icon

      gsap.to('.ai-icon', {
        left: `${startLeft + (currentProgress / 100) * (endLeft - startLeft)}px`,
        duration: 0.3,
        ease: 'none'
      });
    }
  }, [currentProgress]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="text-center flex flex-col items-center gap-8">
        <div className="progress-bar h-[5em] mb-4 mx-auto border-2 border-black rounded-full overflow-hidden flex items-center relative">
          <div className="progress-inner absolute inset-0 flex items-center justify-center">
            <span className="loading-text relative z-10 font-medium text-3xl">
              ĐANG TẢI ... {Math.floor(currentProgress)}%
            </span>
          </div>

          {currentProgress === 100 && (
            <div className="search-icon ml-auto pr-6">
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
          )}
        </div>

        <div className="ai-icon absolute bottom-32">
          <FaRobot className="w-32 h-32" />
          <div className="w-32 h-1 bg-black" />
        </div>

        <div className="ai-icon-target absolute right-32 bottom-32">
          <FaRobot className="opacity-0 w-32 h-32" />
          <div className="w-32 opacity-0 h-1 bg-black" />
        </div>
      </div>
    </div>
  );
}), { ssr: false });

// Wrapper component
export default function LoadingWrapper(props: LoadingProps) {
  return <Loading {...props} />;
}
