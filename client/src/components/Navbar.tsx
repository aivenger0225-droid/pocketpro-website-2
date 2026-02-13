import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage();
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.solutions'), href: "#solutions" },
    { name: t('nav.execution'), href: "#workflow" },
    { name: t('nav.features'), href: "#features" },
    { name: t('nav.audience'), href: "#audience" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/images/pocketpro-logo.png" alt="PocketPro" className="h-10 w-auto" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </a>
          ))}
          
          <div className="flex items-center gap-4 ml-4">
            <button
              onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {language === 'zh' ? 'EN' : '中文'}
            </button>
            <Button size="sm" onClick={() => window.location.href = '#cta'}>
              {t('nav.startFree')}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-border p-4 absolute top-full left-0 right-0 shadow-lg animate-in slide-in-from-top">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium py-2 border-b border-border/50"
              >
                {link.name}
              </a>
            ))}
            <div className="flex items-center justify-between py-2">
               <button
                onClick={() => {
                  setLanguage(language === 'zh' ? 'en' : 'zh');
                  setIsMobileMenuOpen(false);
                }}
                className="text-sm font-medium"
              >
                {language === 'zh' ? '切換為 English' : 'Switch to Chinese'}
              </button>
            </div>
            <Button className="w-full mt-2" onClick={() => {
              window.location.href = '#cta';
              setIsMobileMenuOpen(false);
            }}>
              {t('nav.startFree')}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
