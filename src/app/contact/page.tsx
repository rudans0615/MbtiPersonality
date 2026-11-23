import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: '제휴 및 문의',
  description: 'MBTI Finder 서비스 문의, 문항 오류 신고, 콘텐츠 정정 및 제휴 안내 페이지입니다.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return <ContactClient />;
}
