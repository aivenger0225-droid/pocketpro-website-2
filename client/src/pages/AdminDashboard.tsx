import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Loader2, ArrowLeft, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function AdminDashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();

  const { data: stats, isLoading, error } = trpc.contact.getStats.useQuery(
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
              請登錄以查看儀表板
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
          <Button
            variant="outline"
            onClick={() => setLocation("/admin/contacts")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            查看所有聯繫信息
          </Button>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">儀表板</h1>
          </div>
          <p className="text-muted-foreground">
            查看表單提交數量趨勢
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
        ) : (
          <div className="grid gap-6">
            {/* Stats Summary */}
            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle>統計摘要</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">總提交數</p>
                    <p className="text-4xl font-bold text-primary">{stats?.total || 0}</p>
                  </div>
                  <div className="p-6 bg-blue-100 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">今日提交</p>
                    <p className="text-4xl font-bold text-blue-600">
                      {stats?.daily && stats.daily.length > 0
                        ? stats.daily[stats.daily.length - 1]?.count || 0
                        : 0}
                    </p>
                  </div>
                  <div className="p-6 bg-green-100 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">本月提交</p>
                    <p className="text-4xl font-bold text-green-600">
                      {stats?.monthly && stats.monthly.length > 0
                        ? stats.monthly[stats.monthly.length - 1]?.count || 0
                        : 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Chart */}
            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle>每日提交趨勢（最近30天）</CardTitle>
                <CardDescription>
                  顯示過去30天的每日表單提交數量
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.daily && stats.daily.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.daily}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis
                        dataKey="date"
                        stroke="#666"
                        style={{ fontSize: "12px" }}
                      />
                      <YAxis stroke="#666" style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#ff6b35"
                        strokeWidth={2}
                        dot={{ fill: "#ff6b35", r: 4 }}
                        activeDot={{ r: 6 }}
                        name="提交數"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted-foreground text-center py-8">暫無數據</p>
                )}
              </CardContent>
            </Card>

            {/* Monthly Chart */}
            <Card className="border-border/50 bg-card/80 backdrop-blur">
              <CardHeader>
                <CardTitle>每月提交趨勢（最近12個月）</CardTitle>
                <CardDescription>
                  顯示過去12個月的每月表單提交數量
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.monthly && stats.monthly.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.monthly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis
                        dataKey="month"
                        stroke="#666"
                        style={{ fontSize: "12px" }}
                      />
                      <YAxis stroke="#666" style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="count"
                        fill="#ff6b35"
                        radius={[8, 8, 0, 0]}
                        name="提交數"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-muted-foreground text-center py-8">暫無數據</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
