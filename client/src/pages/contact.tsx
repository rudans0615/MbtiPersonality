import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Contact() {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-neutral-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-6">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-neutral-800 mb-4">문의하기</h1>
                    <p className="text-lg text-neutral-600">
                        궁금한 점이나 제안하고 싶은 내용이 있으시다면 언제든 문의해주세요.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    <Card className="p-8">
                        <CardContent className="p-0">
                            <h2 className="text-2xl font-bold mb-6">연락처 정보</h2>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="bg-primary/10 p-3 rounded-lg mr-4">
                                        <i className="fas fa-envelope text-primary text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-800">이메일</h3>
                                        <p className="text-neutral-600">jkm3151@gmail.com</p>
                                        <p className="text-sm text-neutral-500 mt-1">
                                            상시 확인 후 안내해 드립니다.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-secondary/10 p-3 rounded-lg mr-4">
                                        <i className="fas fa-map-marker-alt text-secondary text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-neutral-800">운영 형태</h3>
                                        <p className="text-neutral-600">온라인 서비스 (MBTI Finder)</p>
                                        <p className="text-sm text-neutral-500 mt-1">
                                            온라인 문의를 우선으로 지원합니다.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="p-8">
                        <CardContent className="p-0">
                            {submitted ? (
                                <div className="text-center py-12">
                                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i className="fas fa-check text-green-600 text-2xl"></i>
                                    </div>
                                    <h3 className="text-xl font-bold text-neutral-800 mb-2">문의가 접수되었습니다</h3>
                                    <p className="text-neutral-600">
                                        빠른 시일 내에 답변 드리겠습니다.
                                    </p>
                                    <Button
                                        className="mt-6 bg-primary"
                                        onClick={() => setSubmitted(false)}
                                    >
                                        새로운 문의하기
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">이름</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                            placeholder="이름을 입력하세요"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">이메일</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">제목</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                            placeholder="문의 제목을 입력하세요"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-1">내용</label>
                                        <textarea
                                            required
                                            rows={4}
                                            className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                                            placeholder="문의하실 내용을 자세히 적어주세요"
                                        ></textarea>
                                    </div>
                                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                                        문의하기
                                    </Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
