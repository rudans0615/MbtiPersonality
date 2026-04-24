import Link from "next/link";
import { getAvailableTests } from "@/data/testTypes";

export default function Footer() {
    const availableTests = getAvailableTests().slice(0, 4);

    return (
        <footer className="relative bg-neutral-950 text-neutral-400 py-16 overflow-hidden">
            {/* Top Gradient Border */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
            
            {/* Background Glow Effect */}
            <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    {/* Brand Section */}
                    <div className="md:col-span-5 lg:col-span-4">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-400 tracking-tight">MBTI Finder</span>
                        </div>
                        <p className="text-neutral-400 leading-relaxed text-sm mb-6 max-w-sm">
                            단순한 호기심을 넘어 당신의 진정한 성향을 발견하세요. 과학적이고 재미있는 심리테스트 플랫폼, MBTI Finder가 함께합니다.
                        </p>
                        <div className="flex space-x-4">
                            <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors">
                                <span className="text-sm">🌐</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors">
                                <span className="text-sm">📱</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors">
                                <span className="text-sm">💌</span>
                            </div>
                        </div>
                    </div>

                    {/* Spacer for Desktop */}
                    <div className="hidden lg:block lg:col-span-2"></div>

                    {/* Links Section */}
                    <div className="md:col-span-3 lg:col-span-3">
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">인기 테스트</h4>
                        <ul className="space-y-4 text-sm">
                            {availableTests.map((test) => (
                                <li key={test.id}>
                                    <Link href={test.href} className="group flex items-center text-neutral-400 hover:text-white transition-colors">
                                        <span className="w-6 opacity-50 group-hover:opacity-100 transition-opacity">{test.emoji}</span> 
                                        <span>{test.title}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="md:col-span-4 lg:col-span-3">
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">고객 지원</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/about" className="hover:text-white transition-colors">서비스 소개</Link></li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">심리 칼럼</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">이용약관</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">제휴 및 문의</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-neutral-500">
                    <div className="flex flex-col md:flex-row items-center md:space-x-4 mb-4 md:mb-0">
                        <p>&copy; {new Date().getFullYear()} MBTI Finder. All rights reserved.</p>
                        <span className="hidden md:inline">|</span>
                        <p className="mt-2 md:mt-0">이메일: jkm3151@gmail.com</p>
                    </div>
                    <p className="flex items-center">
                        Designed with <span className="text-purple-400 mx-1">💜</span> for better understanding
                    </p>
                </div>
            </div>
        </footer>
    );
}
