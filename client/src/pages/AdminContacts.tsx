import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Loader2, Mail, Phone, Building2, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function AdminContacts() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: contacts, isLoading, error } = trpc.contact.getContacts.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-gray-50 to-white">
        <Card className="border-border/50 bg-card/80 backdrop-blur max-w-md">
          <CardHeader>
            <CardTitle>需要登錄</CardTitle>
            <CardDescription>
              請登錄以查看客戶聯繫信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="lg"
              className="w-full"
              onClick={() => {
                window.location.href = getLoginUrl();
              }}
            >
              登錄
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-gray-50 to-white">
        <Card className="border-border/50 bg-card/80 backdrop-blur max-w-md">
          <CardHeader>
            <CardTitle>訪問被拒絕</CardTitle>
            <CardDescription>
              您沒有權限訪問此頁面
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              size="lg"
              className="w-full"
              onClick={() => setLocation("/")}
            >
              返回首頁
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white py-12">
      <div className="container">
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            <Button
              variant="outline"
              onClick={() => setLocation("/")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回首頁
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation("/admin/dashboard")}
            >
              查看儀表板
            </Button>
          </div>
          <h1 className="text-4xl font-bold mb-2">客戶聯繫信息</h1>
          <p className="text-muted-foreground">
            查看所有提交的客戶聯繫信息
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <Card className="border-border/50 bg-card/80 backdrop-blur">
            <CardContent className="p-8">
              <p className="text-red-600">載入失敗: {error.message}</p>
            </CardContent>
          </Card>
        ) : !contacts || contacts.length === 0 ? (
          <Card className="border-border/50 bg-card/80 backdrop-blur">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">暫無客戶聯繫信息</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {contacts.map((contact: any) => (
              <Card
                key={contact.id}
                className="border-border/50 bg-card/80 backdrop-blur hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl">{contact.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-2">
                        <Building2 className="h-4 w-4" />
                        {contact.company}
                      </CardDescription>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(contact.createdAt).toLocaleDateString("zh-TW", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-primary hover:underline break-all"
                    >
                      {contact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-primary hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </div>
                  {contact.message && (
                    <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
                      <p className="text-sm font-semibold text-foreground mb-2">備註：</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {contact.message}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
