import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, Mail } from "lucide-react";
import { useLocation } from "wouter";

interface ContactMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPhoneClick?: () => void;
}

export default function ContactMethodDialog({
  open,
  onOpenChange,
  onPhoneClick,
}: ContactMethodDialogProps) {
  const [, setLocation] = useLocation();

  const handlePhoneClick = () => {
    // 觸發回調函數（用於顯示感謝訊息）
    if (onPhoneClick) {
      onPhoneClick();
    }
    // 撥打電話
    window.location.href = "tel:02-66039370";
  };

  const handleContactForm = () => {
    // 關閉彈窗並跳轉到表單頁面
    onOpenChange(false);
    setLocation("/lead");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            選擇聯繫方式
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-6">
          {/* 電話聯繫選項 */}
          <div
            onClick={handlePhoneClick}
            className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-accent hover:border-primary cursor-pointer transition-all"
          >
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                <Phone className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">直接與我們的專業顧問通話</h3>
              <p className="text-sm text-muted-foreground mt-1">
                獲得即時協助
              </p>
              <p className="text-base font-bold text-primary mt-2">
                02-66039370
              </p>
            </div>
            <div className="flex-shrink-0">
              <Phone className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          {/* 聯繫我們選項 */}
          <div
            onClick={handleContactForm}
            className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-accent hover:border-primary cursor-pointer transition-all"
          >
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold">填寫表單聯繫我們</h3>
              <p className="text-sm text-muted-foreground mt-1">
                我們會盡快回覆您的需求
              </p>
            </div>
            <div className="flex-shrink-0">
              <Mail className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* 底部按鈕 */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            取消
          </Button>
          <Button
            onClick={handleContactForm}
            className="flex-1"
          >
            聯繫我們
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
