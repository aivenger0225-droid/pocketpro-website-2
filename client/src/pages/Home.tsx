/* Design Philosophy: Swiss International Style × Digital Flow
   - Asymmetric grid system with 60/40 golden ratio
   - Bold whitespace and mathematical precision
   - Flowing wave elements for brand identity
   - Typography: Space Grotesk (headings) + Inter (body)
*/

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import ContactMethodDialog from "@/components/ContactMethodDialog";
import { ArrowRight, CheckCircle2, FileText, DollarSign, Calculator, Users, Briefcase, Target, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { trackButtonClick } from "@/lib/seo";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const [, setLocation] = useLocation();
  const { language, t } = useLanguage();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);

  const handleContactClick = () => {
    trackButtonClick("contact-cta", "Contact Dialog Opened");
    setShowContactDialog(true);
  };

  const handlePhoneClick = () => {
    trackButtonClick("phone-contact", "Phone Contact Initiated");
    setShowThankYouMessage(true);
    // 3 秒後自動隱藏感謝訊息
    setTimeout(() => {
      setShowThankYouMessage(false);
    }, 3000);
  };

  useEffect(() => {
    // 設置 SEO 標題（30-60 個字元）
    if (language === 'en') {
      document.title = "PocketPro - Automated Contracts, Payment Processing";
    } else {
      document.title = "口袋經紀 PocketPro - 自動化合約、金流、免費經紀服務";
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".fade-up-on-scroll");
    elements.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [language]);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Thank You Message */}
      {showThankYouMessage && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-green-500 text-white py-4 px-6 flex items-center justify-between animate-in fade-in slide-in-from-top">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium">
              {language === 'en'
                ? "Thank you for calling! Our professional advisor will contact you shortly."
                : "感謝您的來電！我們的專業顧問將盡快與您聯繫。"}
            </p>
          </div>
          <button
            onClick={() => setShowThankYouMessage(false)}
            className="flex-shrink-0 text-white hover:text-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section id="product" className="relative min-h-screen flex items-center overflow-hidden pt-20 bg-white">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-background.png"
            alt="Background"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/70 to-white"></div>
        </div>

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-5 gap-12 items-center">
            {/* Left Content - 60% */}
            <div className="lg:col-span-3 fade-up-on-scroll">
              <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6">
                <span className="text-primary text-sm font-semibold">你的數位經紀與行銷夥伴</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                口袋經紀
                <br />
                <span className="text-primary">PocketPro</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
                自動化合約 + 金流 + 免費經紀服務，讓你專注於市場拓展
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 py-6 group" onClick={handleContactClick}>
                  立即開始
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6" onClick={handleContactClick}>
                  了解更多
                </Button>
              </div>
            </div>

            {/* Right Content - 40% */}
            <div className="lg:col-span-2 fade-up-on-scroll" style={{ animationDelay: "0.2s" }}>
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/20 rounded-full blur-3xl"></div>
                <img
                  src="/images/workflow-visual.png"
                  alt="Workflow"
                  className="relative w-full h-auto animate-float"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-24 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container">
          <div className="text-center mb-16 fade-up-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('painPoints.title')}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('painPoints.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Pain Point 1 */}
            <Card className="fade-up-on-scroll border-border/50 bg-card/80 backdrop-blur hover:-translate-y-2 transition-transform duration-300">
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{t('painPoints.point1.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('painPoints.point1.description')}
                </p>
              </CardContent>
            </Card>

            {/* Pain Point 2 */}
            <Card className="fade-up-on-scroll border-border/50 bg-card/80 backdrop-blur hover:-translate-y-2 transition-transform duration-300" style={{ animationDelay: "0.1s" }}>
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Calculator className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{t('painPoints.point2.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('painPoints.point2.description')}
                </p>
              </CardContent>
            </Card>

            {/* Pain Point 3 */}
            <Card className="fade-up-on-scroll border-border/50 bg-card/80 backdrop-blur hover:-translate-y-2 transition-transform duration-300" style={{ animationDelay: "0.2s" }}>
              <CardContent className="p-8">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{t('painPoints.point3.title')}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t('painPoints.point3.description')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-24">
        <div className="container">
          <div className="text-center mb-16 fade-up-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('solutions.title')}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('solutions.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Solution 1 */}
            <div className="fade-up-on-scroll">
              <div className="relative group">
                <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Card className="relative border-border/50 bg-card/80 backdrop-blur overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src="/images/solution-automation.png"
                      alt="自動化合約管理"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4">{t('solutions.solution1.title')}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {t('solutions.solution1.description')}
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{t('solutions.solution1.feature1')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{t('solutions.solution1.feature2')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{t('solutions.solution1.feature3')}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Solution 2 */}
            <div className="fade-up-on-scroll" style={{ animationDelay: "0.1s" }}>
              <div className="relative group">
                <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Card className="relative border-border/50 bg-card/80 backdrop-blur overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src="/images/solution-payment.png"
                      alt="金流整合"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4" style={{textAlign: 'center'}}>{t('solutions.solution2.title')}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {t('solutions.solution2.description')}
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{t('solutions.solution2.feature1')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{t('solutions.solution2.feature2')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{t('solutions.solution2.feature3')}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Solution 3 */}
            <div className="fade-up-on-scroll" style={{ animationDelay: "0.2s" }}>
              <div className="relative group">
                <div className="absolute -inset-2 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Card className="relative border-border/50 bg-card/80 backdrop-blur overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src="/images/solution-tax.png"
                      alt="自動報稅"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4" style={{textAlign: 'center'}}>{t('solutions.solution3.title')}</h3>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {t('solutions.solution3.description')}
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{t('solutions.solution3.feature1')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{t('solutions.solution3.feature2')}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{t('solutions.solution3.feature3')}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container">
          <div className="text-center mb-16 fade-up-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('workflow.title')}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('workflow.subtitle')}
            </p>
          </div>

          <div className="max-w-5xl mx-auto fade-up-on-scroll">
            {/* Traditional Workflow */}
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-8 text-center text-muted-foreground">傳統流程</h3>
              <div className="flex flex-wrap justify-center items-center gap-4">
                {["找尋人選", "洽談", "簽約", "執行服務", "付薪水", "報稅"].map((step, index) => (
                  <div key={index} className="flex items-center">
                    <div className="px-6 py-3 bg-secondary/50 rounded-lg border border-border">
                      <span className="text-sm font-medium">{step}</span>
                    </div>
                    {index < 5 && (
                      <ArrowRight className="w-5 h-5 text-muted-foreground mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* PocketPro Workflow */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-2xl"></div>
              <div className="relative bg-card/80 backdrop-blur border border-primary/30 rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-8 text-center">
                  <span className="text-primary">PocketPro</span> 一站式完成
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-3">讓您只需要專心在：</p>
                    <div className="flex flex-wrap justify-center items-center gap-4">
                      <div className="flex items-center">
                        <div className="px-6 py-3 bg-primary/20 rounded-lg border border-primary">
                          <span className="text-sm font-semibold">洽談</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-primary mx-2" />
                      </div>
                      <div className="flex items-center">
                        <div className="px-6 py-3 bg-primary/20 rounded-lg border border-primary">
                          <span className="text-sm font-semibold">執行服務</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-primary mb-3">PocketPro 自動化處理：</p>
                    <div className="flex flex-wrap justify-center items-center gap-4">
                      <div className="flex items-center">
                        <div className="px-6 py-3 bg-primary/20 rounded-lg border border-primary">
                          <span className="text-sm font-semibold">簽約</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-primary mx-2" />
                      </div>
                      <div className="flex items-center">
                        <div className="px-6 py-3 bg-primary/20 rounded-lg border border-primary">
                          <span className="text-sm font-semibold">付薪水</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-primary mx-2" />
                      </div>
                      <div className="flex items-center">
                        <div className="px-6 py-3 bg-primary/20 rounded-lg border border-primary">
                          <span className="text-sm font-semibold">報稅</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24">
        <div className="container">
          <div className="text-center mb-16 fade-up-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('features.title')}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="fade-up-on-scroll">
              <Card className="border-border/50 bg-card/80 backdrop-blur h-full">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-xl">1</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">每月提供廠商人選名單</h3>
                      <p className="text-muted-foreground">自行洽談名單（50 筆起）</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    AI爬蟲提供尚未洽談之創作者名單 50 筆起，內含基本資料與連結，讓廠商自行挑選並主動洽談合作
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Feature 2 */}
            <div className="fade-up-on-scroll" style={{ animationDelay: "0.1s" }}>
              <Card className="border-border/50 bg-card/80 backdrop-blur h-full">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-xl">2</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">簽約與執行服務</h3>
                      <p className="text-muted-foreground">自動化合約生成與管理</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">廠商填寫工作需求單</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">接案者確認工作資訊</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">合約自動生成與簽屬/合約更改</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section id="audience" className="py-24 bg-gradient-to-b from-white via-gray-50 to-white">
        <div className="container">
          <div className="text-center mb-16 fade-up-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('targetAudience.title')}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('targetAudience.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Target 1: PR Companies */}
            <div className="fade-up-on-scroll">
              <Card className="border-border/50 bg-card/80 backdrop-blur h-full hover:-translate-y-2 transition-transform duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Briefcase className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{t('targetAudience.audience1.title')}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {t('targetAudience.audience1.description')}
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{t('targetAudience.audience1.benefit1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{t('targetAudience.audience1.benefit2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{t('targetAudience.audience1.benefit3')}</span>
                    </li>
                  </ul>
                   <Button size="sm" className="w-full" onClick={handleContactClick}>
                    {t('nav.startFree')}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Target 2: Integrated Marketing Companies */}
            <div className="fade-up-on-scroll" style={{ animationDelay: "0.1s" }}>
              <Card className="border-border/50 bg-card/80 backdrop-blur h-full hover:-translate-y-2 transition-transform duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{t('targetAudience.audience2.title')}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {t('targetAudience.audience2.description')}
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{t('targetAudience.audience2.benefit1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{t('targetAudience.audience2.benefit2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{t('targetAudience.audience2.benefit3')}</span>
                    </li>
                  </ul>
                  <Button size="sm" className="w-full" onClick={handleContactClick}>
                    {t('nav.startFree')}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Target 3: Brand Marketing Teams */}
            <div className="fade-up-on-scroll" style={{ animationDelay: "0.2s" }}>
              <Card className="border-border/50 bg-card/80 backdrop-blur h-full hover:-translate-y-2 transition-transform duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{t('targetAudience.audience3.title')}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {t('targetAudience.audience3.description')}
                  </p>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{t('targetAudience.audience3.benefit1')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{t('targetAudience.audience3.benefit2')}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{t('targetAudience.audience3.benefit3')}</span>
                    </li>
                  </ul>
                  <Button size="sm" className="w-full" onClick={handleContactClick}>
                    {t('nav.startFree')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Brand Wall Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container">
          <div className="text-center mb-16 fade-up-on-scroll">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">{t('brands.title')}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('brands.description')}
            </p>
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center justify-center fade-up-on-scroll">
            {/* CChannel */}
            <div className="flex items-center justify-center h-24 p-4 bg-white rounded-lg border border-border/50 hover:shadow-md transition-shadow">
              <img src="/images/client-cchannel.png" alt="CChannel" className="max-h-16 w-auto object-contain" />
            </div>

            {/* Megaphone */}
            <div className="flex items-center justify-center h-24 p-4 bg-white rounded-lg border border-border/50 hover:shadow-md transition-shadow">
              <img src="/images/client-megaphone.png" alt="Megaphone" className="max-h-16 w-auto object-contain" />
            </div>

            {/* Hokkaido */}
            <div className="flex items-center justify-center h-24 p-4 bg-white rounded-lg border border-border/50 hover:shadow-md transition-shadow">
              <img src="/images/client-hokkaido.png" alt="Hokkaido" className="max-h-16 w-auto object-contain" />
            </div>

            {/* Round Power */}
            <div className="flex items-center justify-center h-24 p-4 bg-white rounded-lg border border-border/50 hover:shadow-md transition-shadow">
              <img src="/images/client-roundpower.png" alt="Round Power" className="max-h-16 w-auto object-contain" />
            </div>

            {/* GlobalBridge */}
            <div className="flex items-center justify-center h-24 p-4 bg-white rounded-lg border border-border/50 hover:shadow-md transition-shadow">
              <img src="/images/client-globalbridge.png" alt="GlobalBridge" className="max-h-16 w-auto object-contain" />
            </div>

            {/* MMMAX */}
            <div className="flex items-center justify-center h-24 p-4 bg-white rounded-lg border border-border/50 hover:shadow-md transition-shadow">
              <img src="/images/client-mmmax.png" alt="MMMAX" className="max-h-16 w-auto object-contain" />
            </div>

            {/* 55Go */}
            <div className="flex items-center justify-center h-24 p-4 bg-white rounded-lg border border-border/50 hover:shadow-md transition-shadow">
              <img src="/images/client-55go.png" alt="55Go" className="max-h-16 w-auto object-contain" />
            </div>

            {/* Jiao Tang Feng */}
            <div className="flex items-center justify-center h-24 p-4 bg-white rounded-lg border border-border/50 hover:shadow-md transition-shadow">
              <img src="/images/client-jiaotangfeng.png" alt="Jiao Tang Feng" className="max-h-16 w-auto object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-24 relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-white to-white"></div>
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center fade-up-on-scroll">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              {t('cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-12 py-6 group" onClick={() => setLocation("/lead")}>
                {t('cta.button')}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-12 py-6" onClick={handleContactClick}>
                {t('cta.learnMore')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-gray-50">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src="/images/pocketpro-logo.png" alt="PocketPro Logo" className="h-12 w-auto" />
              </div>
              <p className="text-muted-foreground max-w-md">
                {language === 'en' ? t('footer.tagline') : t('footer.tagline')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.product')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#product" className="hover:text-foreground transition-colors">{t('footer.product')}</a></li>
                <li><a href="#workflow" className="hover:text-foreground transition-colors">{t('footer.execution')}</a></li>
                <li><a href="#solutions" className="hover:text-foreground transition-colors">{t('footer.solutions')}</a></li>
                <li><a href="#audience" className="hover:text-foreground transition-colors">{t('footer.audience')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.company')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">{t('footer.about')}</a></li>

              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>

      {/* Contact Method Dialog */}
      <ContactMethodDialog
        open={showContactDialog}
        onOpenChange={setShowContactDialog}
        onPhoneClick={handlePhoneClick}
      />
    </div>
  );
}
