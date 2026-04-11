import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";

export default function Terms() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      
      {/* Header */}
      <div className="gradient-bg text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">이용약관</h1>
          <p className="text-xl opacity-90">서비스 이용에 관한 약관</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <Card className="bg-white rounded-3xl shadow-lg p-8">
          <CardContent className="p-0 space-y-8">
            
            <section>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">제1조 (목적)</h2>
              <p className="text-neutral-700 leading-relaxed">
                이 약관은 MBTI Finder(이하 "서비스")가 제공하는 인터넷 관련 서비스(이하 "서비스")를 
                이용함에 있어 서비스와 이용자의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">제2조 (정의)</h2>
              <div className="text-neutral-700 leading-relaxed space-y-2">
                <p>① "서비스"란 MBTI, 연애유형, 직업적성 등 다양한 심리검사를 제공하는 웹사이트를 의미합니다.</p>
                <p>② "이용자"란 서비스에 접속하여 이 약관에 따라 서비스가 제공하는 콘텐츠를 이용하는 자를 말합니다.</p>
                <p>③ "개인정보"란 개인정보보호법에 따라 보호받는 이용자의 개인정보를 의미합니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">제3조 (약관의 명시 및 효력)</h2>
              <div className="text-neutral-700 leading-relaxed space-y-2">
                <p>① 서비스는 이 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</p>
                <p>② 서비스는 필요한 경우 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.</p>
                <p>③ 약관이 개정되는 경우, 개정된 약관의 적용일자 및 개정사유를 명시하여 현행약관과 함께 공지합니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">제4조 (서비스의 제공)</h2>
              <div className="text-neutral-700 leading-relaxed space-y-2">
                <p>① 서비스는 다음과 같은 업무를 수행합니다:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>MBTI 성격유형 검사 서비스</li>
                  <li>연애유형 분석 서비스</li>
                  <li>직업적성 검사 서비스</li>
                  <li>스트레스 관리 검사 서비스</li>
                  <li>리더십 스타일 분석 서비스</li>
                  <li>의사소통 스타일 검사 서비스</li>
                  <li>기타 심리검사 관련 서비스</li>
                </ul>
                <p>② 서비스는 운영상, 기술상의 필요에 따라 제공되는 서비스를 변경할 수 있습니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">제5조 (서비스 이용)</h2>
              <div className="text-neutral-700 leading-relaxed space-y-2">
                <p>① 서비스 이용은 무료이며, 별도의 회원가입 없이 이용할 수 있습니다.</p>
                <p>② 서비스는 연중무휴, 1일 24시간 제공함을 원칙으로 합니다.</p>
                <p>③ 다만, 시스템 정기점검, 증설 및 교체를 위해 서비스가 일시 중단될 수 있습니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">제6조 (이용자의 의무)</h2>
              <div className="text-neutral-700 leading-relaxed space-y-2">
                <p>① 이용자는 다음 행위를 하여서는 안 됩니다:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>신청 또는 변경 시 허위내용의 등록</li>
                  <li>타인의 정보 도용</li>
                  <li>서비스의 정보를 이용하여 얻은 정보를 서비스의 사전 승낙 없이 복제하거나 이를 출판 및 방송 등에 사용하거나 제3자에게 제공하는 행위</li>
                  <li>서비스의 저작권, 제3자의 저작권 등 기타 권리를 침해하는 행위</li>
                  <li>공공질서 및 미풍양속에 위반되는 내용의 정보, 문장, 도형, 음향, 동영상을 전송, 게시, 전자우편 또는 기타의 방법으로 타인에게 유포하는 행위</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">제7조 (개인정보보호)</h2>
              <div className="text-neutral-700 leading-relaxed space-y-2">
                <p>① 서비스는 이용자의 개인정보를 보호하기 위해 개인정보보호법 등 관련 법령에 따라 노력합니다.</p>
                <p>② 개인정보의 보호 및 사용에 대해서는 관련법령 및 서비스의 개인정보처리방침이 적용됩니다.</p>
                <p>③ 서비스는 이용자의 검사 결과를 저장하지 않으며, 모든 결과는 이용자의 브라우저에서만 처리됩니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">제8조 (면책조항)</h2>
              <div className="text-neutral-700 leading-relaxed space-y-2">
                <p>① 서비스는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</p>
                <p>② 서비스는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여는 책임을 지지 않습니다.</p>
                <p>③ 서비스가 제공하는 심리검사 결과는 전문적인 심리상담이나 의학적 진단을 대체할 수 없으며, 단순 엔터테인먼트(오락) 목적으로만 활용되어야 합니다.</p>
                <p>④ 서비스는 구글 애드센스 등 제3자 광고 시스템을 포함하고 있으며, 쿠팡 파트너스 활동의 일환으로 일정액의 수수료를 제공받을 수 있습니다. 광고 또는 제휴 마케팅 링크 접속으로 인해 발생하는 문제에 대해서는 책임을 지지 않습니다.</p>
                <p>⑤ 이용자가 서비스를 통해 얻은 정보로 인한 직·간접적인 손해에 대해서 서비스는 책임을 지지 않습니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">제9조 (저작권의 귀속)</h2>
              <div className="text-neutral-700 leading-relaxed space-y-2">
                <p>① 서비스가 작성한 저작물에 대한 저작권 및 기타 지적재산권은 서비스에 귀속합니다.</p>
                <p>② 이용자는 서비스를 이용함으로써 얻은 정보 중 서비스에게 지적재산권이 귀속된 정보를 서비스의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안됩니다.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-neutral-800 mb-4">제10조 (재판권 및 준거법)</h2>
              <div className="text-neutral-700 leading-relaxed space-y-2">
                <p>① 서비스와 이용자 간에 발생한 분쟁에 관한 소송은 대한민국 법원이 관할권을 갖습니다.</p>
                <p>② 서비스와 이용자 간에 제기된 소송에는 대한민국법을 적용합니다.</p>
              </div>
            </section>

            <div className="pt-8 border-t border-neutral-200">
              <p className="text-sm text-neutral-500 text-center">
                시행일자: 2025년 6월 27일<br />
                본 약관은 2025년 6월 27일부터 적용됩니다.
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}