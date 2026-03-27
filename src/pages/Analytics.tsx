import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";

const AnalyticsPage = () => {
  const [period, setPeriod] = useState("month");
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [deviceUsage, setDeviceUsage] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [hourly, weekly, devices, monthly] = await Promise.all([
          api.getAnalyticsHourly().catch(() => []),
          api.getAnalyticsWeekly().catch(() => []),
          api.getAnalyticsDeviceUsage().catch(() => []),
          api.getAnalyticsMonthly().catch(() => []),
        ]);
        setHourlyData(hourly);
        setWeeklyData(weekly);
        setDeviceUsage(devices);
        setMonthlyData(monthly);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [period]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Detailed attendance insights</p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Hourly Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {hourlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(224, 20%, 88%)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="hsl(220, 10%, 46%)" interval={3} />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                  <Tooltip />
                  <Area type="monotone" dataKey="checkIns" stroke="hsl(211, 100%, 50%)" fill="hsl(211, 100%, 50%)" fillOpacity={0.15} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">No hourly data available</div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Weekly by Role</CardTitle>
          </CardHeader>
          <CardContent>
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(224, 20%, 88%)" />
                  <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                  <Tooltip />
                  <Bar dataKey="students" fill="hsl(211, 100%, 50%)" radius={[6, 6, 0, 0]} name="Students" />
                  <Bar dataKey="employees" fill="hsl(227, 67%, 80%)" radius={[6, 6, 0, 0]} name="Employees" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">No weekly data available</div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Device Usage</CardTitle>
          </CardHeader>
          <CardContent>
            {deviceUsage.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={deviceUsage} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(224, 20%, 88%)" />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                  <YAxis type="category" dataKey="device" tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" width={100} />
                  <Tooltip />
                  <Bar dataKey="scans" fill="hsl(211, 100%, 50%)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">No device usage data available</div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Monthly Total Scans</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(224, 20%, 88%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="hsl(211, 100%, 50%)" strokeWidth={2.5} dot={{ r: 5, fill: "hsl(211, 100%, 50%)" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">No monthly data available</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
