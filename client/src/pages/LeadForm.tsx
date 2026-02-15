import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, CheckCircle, ArrowRight } from "lucide-react";

export default function LeadForm() {
  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", company: "",
    industry: "", industryOther: "", budget: "", painPoint: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const phoneRegex = /^09\d{2}-?\d{3}-?\d{3}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.name.trim()) newErrors.name = "請輸入姓名";
    if (!phoneRegex.test(formData.phone)) newErrors.phone = "請輸入正確的手機號碼";
    if (!emailRegex.test(formData.email)) newErrors.email = "請輸入正確的 Email 格式";
    if (!formData.company.trim()) newErrors.company = "請輸入公司名稱";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitLeadMutation = trpc.lead.submitLead.useMutation({
    onSuccess: () => { 
      setIsSuccess(true); 
      toast.success("感謝您的填寫！"); 
    },
    onError: (error: any) => { 
      toast.error(error.message || "提交失敗"); 
    },
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleIndustryChange = (value: string) => {
    setFormData(prev => ({ ...prev, industry: value, industryOther: value === "其他" ? prev.industryOther : "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try
    {
      await submitLeadMutation.mutateAsync(formData);
    } catch (error) { 
      console.error(error); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white py-12 px-4 text-center">
        <div className="container max-w-2xl">
          <Card className="py-12">
            <CardContent>
              <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">感謝您的填寫！</h2>
              <p className="text-muted-foreground">專屬顧問將在 24 小時內與您聯繫。</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white py-12 px-4">
      <div className="container max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">開始使用 PocketPro</h1>
          <p className="text-lg text-muted-foreground">填寫以下表單，我們會安排專屬顧問與您聯繫</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>聯絡資訊</CardTitle>
            <CardDescription>請填寫基本資料，我們將盡快與您聯繫</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>姓名 *</Label>
                  <Input name="name" value={formData.name} onChange={handleChange} placeholder="請輸入您的姓名" />
                  {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <Label>聯絡電話 *</Label>
                  <Input name="phone" type="text" inputMode="tel" value={formData.phone} onChange={handleChange} placeholder="09XX-XXX-XXX" />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input name="email" type="text" inputMode="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" />
                  {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label>公司名稱 *</Label>
                  <Input name="company" value={formData.company} onChange={handleChange} placeholder="請輸入公司名稱" />
                  {errors.company && <p className="text-xs text-red-500">{errors.company}</p>}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>產業類型</Label>
                  <Select value={formData.industry} onValueChange={handleIndustryChange}>
                    <SelectTrigger><SelectValue placeholder="請選擇產業類型" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="品牌商">品牌商</SelectItem>
                      <SelectItem value="公關公司">公關公司</SelectItem>
                      <SelectItem value="行銷活動">行銷活動</SelectItem>
                      <SelectItem value="經紀公司">經紀公司</SelectItem>
                      <SelectItem value="其他">其他</SelectItem>
                    </SelectContent>
                  </Select>
                  {formData.industry === "其他" && (
                    <Input name="industryOther" value={formData.industryOther} onChange={handleChange} placeholder="請說明您的產業" className="mt-2" />
                  )}
                </div>
                <div className="space-y-2">
                  <Label>每月預算</Label>
                  <Select value={formData.budget} onValueChange={(v) => setFormData(p => ({ ...p, budget: v }))}>
                    <SelectTrigger><SelectValue placeholder="請選擇預算範圍" /></SelectTrigger>
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
              <div className="space-y-2">
                <Label>目前的痛點或需求</Label>
                <Textarea name="painPoint" value={formData.painPoint} onChange={handleChange} placeholder="請描述您目前面臨的問題（選填）" rows={4} />
              </div>
              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 提交中...</>) : (<>提交資料 <ArrowRight className="ml-2 h-4 w-4" /></>)}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
