"use client";
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const email = 'jkm3151@gmail.com';

export default function ContactClient() {
  const [message, setMessage] = useState('');
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setMessage('이메일 주소를 복사했습니다.');
    } catch {
      setMessage('복사하지 못했습니다. 아래 이메일 주소를 선택해 직접 복사해주세요.');
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-6 pt-28 pb-16">
      <h1 className="text-4xl font-bold text-center mb-6">문의하기</h1>
      <p className="text-neutral-600 text-center mb-10">
        서비스 문의, 오류 신고, 콘텐츠 정정 요청 및 협업 제안을 이메일로 보내주세요.
      </p>
      <Card className="p-8">
        <CardContent className="p-0 space-y-6">
          <h2 className="text-2xl font-bold">이메일 문의</h2>
          <p className="text-lg select-all break-all">{email}</p>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <a href={'mailto:' + email + '?subject=' + encodeURIComponent('[MBTI Finder] 문의')}>
                이메일 앱 열기
              </a>
            </Button>
            <Button variant="outline" onClick={copyEmail}>
              이메일 주소 복사
            </Button>
          </div>
          <p role="status" aria-live="polite">{message}</p>
          <p className="text-neutral-600">
            이메일 앱에서 내용을 작성한 뒤 직접 발송해주세요. 이 페이지에서 문의가 자동 접수되지는 않습니다.
          </p>
          <p className="text-sm text-neutral-500">
            이메일 앱이 열리지 않으면 주소를 복사해 사용 중인 웹메일에서 보내주세요. 오류 신고 시 문제가 발생한 검사 이름과 상황을 함께 적어주시면 도움이 됩니다.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
