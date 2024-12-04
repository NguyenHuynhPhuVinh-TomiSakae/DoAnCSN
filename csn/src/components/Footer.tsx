'use client';
import { Be_Vietnam_Pro } from 'next/font/google';
import Link from 'next/link';

const beVietnamPro = Be_Vietnam_Pro({
    subsets: ['vietnamese'],
    weight: ['400', '500', '600'],
    display: 'swap',
});

export default function Footer() {
    return (
        <footer className={`bg-white text-black py-16 ${beVietnamPro.className}`}>
            <div className="container mx-auto px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Cột 1: Giới thiệu */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold mb-4">AI Tools Hub</h3>
                        <p className="text-gray-600">
                            Nền tảng tổng hợp và đánh giá các công cụ AI hàng đầu Việt Nam
                        </p>
                    </div>

                    {/* Cột 2: Liên kết */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Liên Kết</h3>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-gray-600 hover:text-black">Trang chủ</Link></li>
                            <li><Link href="/tools" className="text-gray-600 hover:text-black">Công cụ AI</Link></li>
                            <li><Link href="/blog" className="text-gray-600 hover:text-black">Blog</Link></li>
                            <li><Link href="/about" className="text-gray-600 hover:text-black">Về chúng tôi</Link></li>
                        </ul>
                    </div>

                    {/* Cột 3: Hỗ trợ */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Hỗ Trợ</h3>
                        <ul className="space-y-2">
                            <li><Link href="/contact" className="text-gray-600 hover:text-black">Liên hệ</Link></li>
                            <li><Link href="/faq" className="text-gray-600 hover:text-black">FAQ</Link></li>
                            <li><Link href="/privacy" className="text-gray-600 hover:text-black">Chính sách bảo mật</Link></li>
                            <li><Link href="/terms" className="text-gray-600 hover:text-black">Điều khoản sử dụng</Link></li>
                        </ul>
                    </div>

                    {/* Cột 4: Theo dõi */}
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Theo Dõi</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-600 hover:text-black">
                                <i className="fab fa-facebook text-2xl"></i>
                            </a>
                            <a href="#" className="text-gray-600 hover:text-black">
                                <i className="fab fa-twitter text-2xl"></i>
                            </a>
                            <a href="#" className="text-gray-600 hover:text-black">
                                <i className="fab fa-linkedin text-2xl"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-12 pt-8 text-center text-gray-600">
                    <p>&copy; {new Date().getFullYear()} AI Tools Hub. Tất cả quyền được bảo lưu.</p>
                </div>
            </div>
        </footer>
    );
}
