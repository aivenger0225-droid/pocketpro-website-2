import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, MessageCircle } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitContactMutation = trpc.contact.submitContact.useMutation({
    onSuccess: () => {
      toast.success("感謝您的聯繫！我們會盡快回覆您。");
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone || !formData.company) {
      toast.error("請填寫所有必填欄位");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitContactMutation.mutateAsync(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white py-12">
      <div className="container max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-3xl">聯繫我們</CardTitle>
                <CardDescription>
                  填寫下方表單，我們的團隊會盡快與您聯繫
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
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

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">郵箱 *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="請輸入您的郵箱"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">電話 *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="請輸入您的電話號碼"
                      required
                    />
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <Label htmlFor="company">公司名稱 *</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="請輸入您的公司名稱"
                      required
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">備註</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="請輸入您的需求或備註（選填）"
                      rows={4}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting || submitContactMutation.isPending}
                  >
                    {isSubmitting || submitContactMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        提交中...
                      </>
                    ) : (
                      "提交聯繫信息"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* LINE Contact Section */}
          <div className="flex flex-col gap-6">
            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                  官方 LINE
                </CardTitle>
                <CardDescription>
                  掃描 QR Code 或點擊連結
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* QR Code */}
                <div className="flex justify-center">
                  <img
                    src="/images/line-qrcode.png"
                    alt="LINE QR Code"
                    className="w-48 h-48 border-2 border-border rounded-lg p-2 bg-white"
                  />
                </div>

                {/* LINE Link Button */}
                <a
                  href="https://lin.ee/bMcM48N"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                    size="lg"
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    加入 LINE 官方帳號
                  </Button>
                </a>

                <p className="text-sm text-muted-foreground text-center">
                  或掃描上方 QR Code 快速加入
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
