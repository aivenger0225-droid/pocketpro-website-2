import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, CheckCircle, ArrowRight, Zap, Shield, Clock } from "lucide-react";

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
    industry: "",
    industryOther: "",
    budget: "",
    painPoint: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const submitLeadMutation = trpc.lead.submitLead.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
      toast.success("感謝您的填寫！我們會盡快與您聯繫。");
    },
    onError: (error: any) => {
      toast.error(`提交失敗: ${error.message}`);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIndustryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      industry: value,
      industryOther: value === "其他" ? prev.industryOther : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone || !formData.email || !formData.company) {
      toast.error("請填寫基本聯絡資訊（姓名、電話、Email、公司名稱）");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await submitLeadMutation.mutateAsync({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        company: formData.company,
        industry: formData.industry,
        industryOther: formData.industryOther,
        budget: formData.budget,
        painPoint: formData.painPoint,
      });
      setIsSuccess(true);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success State
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white py-12">
        <div className="container max-w-2xl">
          <Card className="border-border/50 bg-card/80 backdrop-blur text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">感謝您的填寫！</h2>
                  <p className="text-muted-foreground">
                    我們已經收到您的資料，專屬顧問將在 24 小時內與您聯繫。
                  </p>
                </div>
                <div className="grid sm:grid-cols-3 gap-4 w-full mt-8">
                  <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
                    <Zap className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium">快速回覆</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
                    <Shield className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium">資料保密</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg">
                    <Clock className="w-6 h-6 text-primary" />
                    <span className="text-sm font-medium">專業顧問</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white py-12">
      <div className="container max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">開始使用 PocketPro</h1>
          <p className="text-lg text-muted-foreground">
            填寫以下表單，我們會安排專屬顧問與您聯繫
          </p>
        </div>

        <Card className="border-border/50 bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-xl">聯絡資訊</CardTitle>
            <CardDescription>
              請填寫基本資料，我們將盡快與您聯繫
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Phone */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">姓名 *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="請輸入您的姓名"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">聯絡電話 *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="09XX-XXX-XXX"
                    required
                  />
                </div>
              </div>

              {/* Email & Company */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">公司名稱 *</Label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="請輸入公司名稱"
                    required
                  />
                </div>
              </div>

              {/* Industry & Budget */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>產業類型</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={handleIndustryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="請選擇產業類型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="品牌商">品牌商</SelectItem>
                      <SelectItem value="公關公司">公關公司</SelectItem>
                      <SelectItem value="行銷活動">行銷活動</SelectItem>
                      <SelectItem value="經紀公司">經紀公司</SelectItem>
                      <SelectItem value="其他">其他</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.industry === "其他" && (
                    <Input
                      name="industryOther"
                      value={formData.industryOther}
                      onChange={handleChange}
                      placeholder="請說明您的產業"
                      className="mt-2"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>每月預算</Label>
                  <Select
                    value={formData.budget}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, budget: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="請選擇預算範圍" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5千以下">5,000 元以下</SelectItem>
                      <SelectItem value="5千-1萬">5,000 - 10,000 元</SelectItem>
                      <SelectItem value="1萬-3萬">10,000 - 30,000 元</SelectItem>
                      <SelectItem value="3萬-5萬">30,000 - 50,000 元</SelectItem>
                      <SelectItem value="5萬以上">50,000 元以上</SelectItem>
                      <SelectItem value="尚在評估">尚在評估中</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Pain Point */}
              <div className="space-y-2">
                <Label htmlFor="painPoint">目前的痛點或需求</Label>
                <Textarea
                  id="painPoint"
                  name="painPoint"
                  value={formData.painPoint}
                  onChange={handleChange}
                  placeholder="請描述您目前面臨的問題，例如：合約處理麻煩、請款流程繁瑣、人員管理困難等（選填）"
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting || submitLeadMutation.isPending}
              >
                {isSubmitting || submitLeadMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    提交中...
                  </>
                ) : (
                  <>
                    提交資料
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                提交即表示您同意我們的隱私權政策。我們會妥善保護您的個人資料。
              </p>
            </form>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="grid sm:grid-cols-3 gap-4 mt-8">
          <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg text-center">
            <Zap className="w-8 h-8 text-primary" />
            <span className="font-medium">快速上手</span>
            <span className="text-sm text-muted-foreground">專人協助設定</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg text-center">
            <Shield className="w-8 h-8 text-primary" />
            <span className="font-medium">資料安全</span>
            <span className="text-sm text-muted-foreground">銀行級別加密</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg text-center">
            <Clock className="w-8 h-8 text-primary" />
            <span className="font-medium">節省時間</span>
            <span className="text-sm text-muted-foreground">自動化流程</span>
          </div>
        </div>
      </div>
    </div>
  );
}
