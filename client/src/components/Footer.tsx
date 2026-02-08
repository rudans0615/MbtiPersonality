import { Link } from "wouter";

export default function Footer() {
    return (
        <footer className="bg-neutral-800 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold">심리테스트</span>
                        </div>
                        <p className="text-neutral-400 mb-4">
                            과학적으로 검증된 심리 테스트로 당신의 진정한 모습을 발견하세요.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">테스트</h4>
                        <ul className="space-y-2 text-neutral-400">
                            <li><Link href="/test" className="hover:text-white transition-colors">MBTI 성격유형 검사</Link></li>
                            <li><Link href="/teto-egen-test" className="hover:text-white transition-colors">테토 vs 에겐 진단</Link></li>
                            <li><Link href="/drunk-test" className="hover:text-white transition-colors">나 술 취했나? 테스트</Link></li>
                            <li><span className="text-neutral-500">연애유형 검사 (출시예정)</span></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-semibold mb-4">정보</h4>
                        <ul className="space-y-2 text-neutral-400">
                            <li><Link href="/about" className="hover:text-white transition-colors">소개</Link></li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">블로그</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">문의하기</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">이용약관</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-neutral-700 pt-8 text-center text-neutral-400">
                    <p>&copy; 2025 심리테스트. 모든 권리 보유.</p>
                </div>
            </div>
        </footer>
    );
}
