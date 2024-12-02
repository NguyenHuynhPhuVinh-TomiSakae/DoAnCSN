/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import dynamic from 'next/dynamic';
import { useEffect, useState, useRef } from 'react';
import { FaRobot } from "react-icons/fa";
import gsap from 'gsap';
import { motion } from 'framer-motion';
import anime from 'animejs';
import { Be_Vietnam_Pro, Orbitron } from 'next/font/google'
import { useLoading } from '@/context/LoadingContext';
import Marquee from 'react-fast-marquee';

interface LoadingProps {
  onLoadComplete: () => void;
}

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

// Cập nhật mảng searchTerms với các từ khóa thân thiện với người dùng hơn
const searchTerms = [
  // Dòng 1 - Chạy từ phải sang trái
  ["Tạo ảnh AI", "Chỉnh sửa ảnh", "Xóa phông nền", "Phục hồi ảnh cũ", "Tạo avatar", "Chuyển ảnh hoạt hình", "Tạo ảnh AI", "Chỉnh sửa ảnh", "Xóa phông nền", "Phục hồi ảnh cũ", "Tạo avatar", "Chuyển ảnh hoạt hình", "Tạo ảnh AI", "Chỉnh sửa ảnh", "Xóa phông nền", "Phục hồi ảnh cũ", "Tạo avatar", "Chuyển ảnh hoạt hình"],
  // Dòng 2 - Chạy từ trái sang phải
  ["Tạo video AI", "Lồng tiếng video", "Chuyển giọng nói", "Tạo nhạc AI", "Chỉnh sửa video", "Tạo video từ ảnh", "Tạo video AI", "Lồng tiếng video", "Chuyển giọng nói", "Tạo nhạc AI", "Chỉnh sửa video", "Tạo video từ ảnh", "Tạo video AI", "Lồng tiếng video", "Chuyển giọng nói", "Tạo nhạc AI", "Chỉnh sửa video", "Tạo video từ ảnh"],
  // Dòng 3 - Chạy từ phải sang trái
  ["Chat với AI", "Viết content", "Dịch văn bản", "Phân tích dữ liệu", "Tạo mã nguồn", "Hỗ trợ học tập", "Chat với AI", "Viết content", "Dịch văn bản", "Phân tích dữ liệu", "Tạo mã nguồn", "Hỗ trợ học tập", "Chat với AI", "Viết content", "Dịch văn bản", "Phân tích dữ liệu", "Tạo mã nguồn", "Hỗ trợ học tập"],
  // Dòng 4 - Chạy từ trái sang phải
  ["Tạo 3D AI", "Thiết kế logo", "Tạo hình nền", "Chỉnh màu ảnh", "Ghép ảnh AI", "Tạo ảnh 3D", "Tạo 3D AI", "Thiết kế logo", "Tạo hình nền", "Chỉnh màu ảnh", "Ghép ảnh AI", "Tạo ảnh 3D", "Tạo 3D AI", "Thiết kế logo", "Tạo hình nền", "Chỉnh màu ảnh", "Ghép ảnh AI", "Tạo ảnh 3D"]
];

// Tạo component với SSR disabled
const Loading = dynamic(() => Promise.resolve(({ onLoadComplete }: LoadingProps) => {
  const { setIsLoading } = useLoading();
  const [currentProgress, setCurrentProgress] = useState(0);
  const progressRef = useRef(0);
  // Thêm state mới để theo dõi khi đã hoàn thành
  const [isCompleted, setIsCompleted] = useState(false);

  // Thêm ref cho animation anime.js
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [showTerms, setShowTerms] = useState(false);

  // Thêm state mới để quản lý việc hiển thị từng hàng
  const [visibleRows, setVisibleRows] = useState<boolean[]>([false, false, false, false]);

  // Sửa đổi hàm animateProgress
  const animateProgress = (targetProgress: number) => {
    // Nếu đã hoàn thành, không cho phép giảm tiến trình
    if (isCompleted) return;

    // Đảm bảo targetProgress không nhỏ hơn giá trị hiện tại
    const newTarget = Math.max(targetProgress, currentProgress);

    anime({
      targets: progressRef,
      current: newTarget,
      duration: 800,
      easing: 'easeOutQuad',
      update: () => {
        const progress = Math.floor(progressRef.current);
        setCurrentProgress(progress);
        if (progress === 100) {
          setIsCompleted(true);
        }
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
    gsap.set(['.showai-text', '.showai-description'], { y: -50, visibility: 'hidden' });

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
        console.error('Lỗi khi ti trước dữ liệu:', error);
        onLoadComplete();
      }
    };
  }, [onLoadComplete]);

  useEffect(() => {
    if (currentProgress === 100) {
      setIsLoading(false);
      gsap.set('.search-icon', { opacity: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to('.ai-icon', {
            y: 200,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.in',
            onComplete: () => {
              // Thay đổi display để xóa hoàn toàn icon AI
              gsap.set('.ai-icon', { display: 'none' });

              gsap.set(['.showai-text', '.showai-description'], { visibility: 'visible', opacity: 1 });
              gsap.to('.showai-text', {
                y: 0,
                duration: 0.8,
                ease: 'power2.out'
              });
              gsap.to('.showai-description', {
                y: 0,
                duration: 0.8,
                ease: 'power2.out',
                delay: 0.2,
                onComplete: () => {
                  setShowTerms(true); // Hiển thị terms sau khi SHOWAI hoàn tất
                }
              });
            }
          });
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
        }, '<')
        .to('.search-icon', {
          opacity: 1,
          duration: 0.5,
          ease: 'power2.inOut'
        }, '-=0.8');
    }
  }, [currentProgress, setIsLoading]);

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

  useEffect(() => {
    if (showTerms) {
      // Animation hiện dần các hàng terms
      const showRowsSequentially = () => {
        setVisibleRows(prev => {
          const newState = [...prev];
          const nextIndex = newState.findIndex(visible => !visible);
          if (nextIndex !== -1) {
            newState[nextIndex] = true;
          }
          return newState;
        });
      };

      // Hiện các hàng với delay
      const interval = setInterval(showRowsSequentially, 200);
      return () => clearInterval(interval);
    }
  }, [showTerms]);

  // Sửa đổi phần return để sử dụng motion components
  return (
    <motion.div
      className={`fixed inset-0 bg-white ${beVietnamPro.className}`}
      style={{ height: '100vh' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-full relative">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 text-center">
          <div className={`showai-text text-9xl font-bold mb-4 opacity-0 invisible ${orbitron.className} tracking-wider`}>
            SHOWAI
          </div>
          <div className="showai-description text-xl mb-8 opacity-0 invisible">
            Khám phá các công cụ <span className={`${beVietnamPro.className} font-bold text-2xl`}>AI</span> hàng đầu
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            ref={progressBarRef}
            className="progress-bar h-[5em] mx-auto border-2 border-black rounded-full overflow-hidden flex items-center relative"
            initial={{ width: '5em' }}
            animate={{ width: '50em' }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
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
          </motion.div>
        </div>

        <motion.div
          className="ai-icon absolute bottom-32"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <FaRobot className="w-32 h-32" />
          <div className="w-32 h-1 bg-black" />
        </motion.div>

        <div className="ai-icon-target absolute right-32 bottom-32">
          <FaRobot className="opacity-0 w-32 h-32" />
          <div className="w-32 opacity-0 h-1 bg-black" />
        </div>

        {showTerms && (
          <div className="absolute top-[60%] left-0 right-0 flex flex-col gap-2">
            {searchTerms.map((row, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: visibleRows[index] ? 1 : 0,
                  y: visibleRows[index] ? 0 : 20
                }}
                transition={{ duration: 0.5 }}
              >
                <Marquee
                  speed={50}
                  gradient={false}
                  direction={index % 2 === 0 ? "left" : "right"}
                  className="mb-2"
                >
                  {row.map((term, termIndex) => (
                    <div
                      key={termIndex}
                      className="px-3 py-1.5 mx-1 border-2 border-black bg-white text-black rounded-lg font-medium"
                    >
                      {term}
                    </div>
                  ))}
                </Marquee>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}), { ssr: false });

// Wrapper component
export default function LoadingWrapper(props: LoadingProps) {
  return <Loading {...props} />;
}
