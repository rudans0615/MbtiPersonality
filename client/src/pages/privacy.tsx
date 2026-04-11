import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import SEO from "@/components/SEO";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <SEO title="개인정보처리방침 | MBTI Finder" description="MBTI Finder의 개인정보 수집, 이용, 보호에 관한 정책입니다." url="https://mbtifinder.com/privacy" />
      <Navigation />
      
      {/* Header */}
      <div className="gradient-bg text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">개인정보처리방침</h1>
          <p className="text-xl opacity-90">개인정보 보호에 관한 정책</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <Card className="bg-white rounded-3xl shadow-lg p-8">
          <CardContent className="p-0 space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">1. 개인정보의 처리목적</h2>
              <div className="text-neutral-700 leading-relaxed space-y-2">
                <p>MBTI Finder(이하 "서비스")는 다음의 목적을 위하여 개인정보를 처리합니다:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>서비스 제공 및 운영</li>
                  <li>웹사이트 이용 통계 분석 및 서비스 개선</li>
                  <li>법령 및 서비스 이용약관 위반 행위에 대한 대응</li>
                </ul>
                <p className="mt-4 font-semibold">※ 본 서비스는 회원가입을 요구하지 않으며, 심리검사 결과를 서버에 저장하지 않습니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">2. 개인정보의 처리 및 보유기간</h2>
              <div className="text-neutral-700 leading-relaxed space-y-2">
                <p>① 서비스는 이용자의 개인정보를 별도로 수집하거나 저장하지 않습니다.</p>
                <p>② 심리검사 결과는 이용자의 브라우저(세션 스토리지)에만 임시 저장되며, 브라우저를 닫으면 자동으로 삭제됩니다.</p>
                <p>③ Google Analytics를 통해 수집되는 웹사이트 이용 통계는 Google의 개인정보처리방침에 따라 처리됩니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">3. 개인정보의 제3자 제공</h2>
              <div className="text-neutral-700 leading-relaxed space-y-2">
                <p>① 서비스는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다.</p>
                <p>② 다만, 아래의 경우에는 예외로 합니다:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>법령의 규정에 의하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
                  <li>Google Analytics 서비스 이용을 위한 Google로의 통계 정보 제공</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">4. 개인정보 처리의 위탁</h2>
              <div className="text-neutral-700 leading-relaxed space-y-2">
                <p>서비스는 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</p>
                <div className="bg-neutral-50 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold mb-2">Google Analytics 및 Google AdSense</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                    <li>위탁받는 자: Google LLC</li>
                    <li>위탁하는 업무의 내용: 웹사이트 방문자 통계 분석 및 맞춤형 광고 제공</li>
                    <li>위탁기간: 서비스 제공 기간</li>
                  </ul>
                </div>
                <div className="bg-neutral-50 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold mb-2">쿠팡 파트너스</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
                    <li>위탁받는 자: 쿠팡(주)</li>
                    <li>위탁하는 업무의 내용: 서비스 내 제휴 링크 제공에 따른 수익성 분석</li>
                    <li>위탁기간: 서비스 제공 기간</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">5. 정보주체의 권리·의무 및 행사방법</h2>
              <div className="text-neutral-700 leading-relaxed space-y-2">
                <p>① 정보주체는 서비스에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>개인정보 처리정지 요구권</li>
                  <li>개인정보 수정·삭제권 (해당 시)</li>
                  <li>손해배상청구권</li>
                </ul>
                <p>② 본 서비스는 개인정보를 직접 수집하지 않으므로, 대부분의 개인정보 관련 권리 행사가 해당되지 않습니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">6. 쿠키(Cookie)의 사용</h2>
              <div className="text-neutral-700 leading-relaxed space-y-2">
                <p>① 서비스는 다음과 같은 목적을 위해 쿠키를 사용합니다:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>웹사이트 이용 패턴 분석 (Google Analytics)</li>
                  <li>맞춤형 기만성 및 문맥형 광고 송출 (Google AdSense 등)</li>
                  <li>제휴 마케팅 성과 추적 (쿠팡 파트너스 등 가상 제휴 링크 추적)</li>
                  <li>서비스 개선 및 맞춤화</li>
                </ul>
                <p>② 이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키 저장 시 확인을 거치거나, 아니면 모든 쿠키의 저장을 거부할 수도 있습니다.</p>
                <p>③ 단, 쿠키의 저장을 거부할 경우에는 서비스의 일부 기능 이용에 어려움이 있을 수 있습니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">7. 개인정보의 안전성 확보조치</h2>
              <div className="text-neutral-700 leading-relaxed space-y-2">
                <p>서비스는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>정기적인 자체 감사 실시</li>
                  <li>개인정보에 대한 접근 제한</li>
                  <li>개인정보를 처리하는 데이터베이스시스템에 대한 접근권한의 부여·변경·말소를 통한 개인정보에 대한 접근통제</li>
                  <li>개인정보의 안전한 저장을 위한 보안프로그램 설치 및 갱신</li>
                  <li>개인정보의 위·변조 방지를 위한 보안기능 사용</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">8. 개인정보보호책임자</h2>
              <div className="text-neutral-700 leading-relaxed space-y-2">
                <p>서비스는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보보호책임자를 지정하고 있습니다:</p>
                <div className="bg-neutral-50 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold mb-2">개인정보보호책임자</h4>
                  <ul className="space-y-1 text-sm">
                    <li>담당부서: MBTI Finder 운영팀</li>
                    <li>이메일: jkm3151@gmail.com</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">9. 권익침해 구제방법</h2>
              <div className="text-neutral-700 leading-relaxed space-y-2">
                <p>정보주체는 아래의 기관에 대해 개인정보 침해신고를 접수하거나 상담을 받을 수 있습니다:</p>
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">개인정보보호위원회</h4>
                    <ul className="space-y-1 text-sm">
                      <li>전화: 02-2100-2820</li>
                      <li>웹사이트: privacy.go.kr</li>
                    </ul>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">개인정보보호 종합지원 포털</h4>
                    <ul className="space-y-1 text-sm">
                      <li>전화: 1833-6972</li>
                      <li>웹사이트: privacy.go.kr</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">10. 개인정보처리방침의 변경</h2>
              <div className="text-neutral-700 leading-relaxed space-y-2">
                <p>① 이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>
                <p>② 단, 수집하는 개인정보의 항목, 이용목적의 변경 등과 같이 이용자 권리의 중대한 변경이 발생할 때에는 최소 30일 전에 미리 알려드리겠습니다.</p>
              </div>
            </section>

            <div className="pt-8 border-t border-neutral-200">
              <p className="text-sm text-neutral-500 text-center">
                시행일자: 2025년 6월 27일<br />
                본 개인정보처리방침은 2025년 6월 27일부터 적용됩니다.
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}