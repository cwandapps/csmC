import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Cpu, ClipboardList, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";
import { api } from "@/lib/api";

const CHART_COLORS = ["hsl(211, 100%, 50%)", "hsl(227, 67%, 70%)", "hsl(224, 40%, 80%)"];

const defaultStats = [
  { label: "Total Users", value: "—", change: "—", up: true, icon: Users },
  { label: "Active Devices", value: "—", change: "—", up: true, icon: Cpu },
  { label: "Today's Check-ins", value: "—", change: "—", up: true, icon: ClipboardList },
  { label: "Attendance Rate", value: "—", change: "—", up: true, icon: TrendingUp },
];

const Dashboard = () => {
  const [stats, setStats] = useState(defaultStats);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [methodData, setMethodData] = useState<any[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    // Try to load real stats; fall back to computed from user/device/attendance lists
    const loadData = async () => {
      try {
        const [users, devices, attendance] = await Promise.all([
          api.getUsers().catch(() => []),
          api.getDevices().catch(() => []),
          api.getAttendance({ limit: 200 }).catch(() => []),
        ]);

        const records = Array.isArray(attendance) ? attendance : (attendance as any)?.data || [];
        const today = new Date().toISOString().slice(0, 10);
        const todayRecords = records.filter((r: any) => r.timestamp?.startsWith(today) || r.date?.startsWith(today));

        setStats([
          { label: "Total Users", value: String(users.length || 0), change: "+0", up: true, icon: Users },
          { label: "Active Devices", value: String((devices as any[]).filter((d: any) => d.status === 'active').length), change: "+0", up: true, icon: Cpu },
          { label: "Today's Check-ins", value: String(todayRecords.filter((r: any) => r.status === 'check_in').length), change: "+0", up: true, icon: ClipboardList },
          { label: "Attendance Rate", value: users.length ? `${Math.round((todayRecords.length / users.length) * 100)}%` : "0%", change: "—", up: true, icon: TrendingUp },
        ]);

        // Build method pie chart from records
        const methods: Record<string, number> = {};
        records.forEach((r: any) => { methods[r.method || 'card'] = (methods[r.method || 'card'] || 0) + 1; });
        setMethodData(Object.entries(methods).map(([name, value]) => ({ name, value })));

        // Recent activity
        setRecentActivity(records.slice(0, 5).map((a: any) => ({
          user: `${a.first_name || ''} ${a.last_name || ''}`.trim() || 'Unknown',
          action: a.status === 'check_in' ? 'Check-in' : 'Check-out',
          device: a.device_name || '—',
          time: a.timestamp ? new Date(a.timestamp).toLocaleTimeString() : '—',
          method: a.method || 'card',
        })));
      } catch { /* silent */ }

      // Try real analytics endpoints
      try {
        const weekly = await api.getAnalyticsWeekly();
        if (Array.isArray(weekly) && weekly.length) setWeeklyData(weekly);
      } catch { /* use empty */ }

      try {
        const monthly = await api.getAnalyticsMonthly();
        if (Array.isArray(monthly) && monthly.length) setMonthlyTrend(monthly);
      } catch { /* use empty */ }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your attendance system</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className="glass-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? "text-success" : "text-destructive"}`}>
                    {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Weekly Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            {weeklyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(224, 20%, 88%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(224, 20%, 88%)" }} />
                  <Bar dataKey="checkIns" fill="hsl(211, 100%, 50%)" radius={[6, 6, 0, 0]} name="Check-ins" />
                  <Bar dataKey="checkOuts" fill="hsl(227, 67%, 80%)" radius={[6, 6, 0, 0]} name="Check-outs" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">No weekly data yet</div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Auth Methods</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {methodData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={methodData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                      {methodData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-2">
                  {methodData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2 text-xs">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                      <span className="text-muted-foreground capitalize">{d.name} {d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">No data yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(224, 20%, 88%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                  <YAxis domain={[0, 'auto']} tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                  <Tooltip />
                  <Line type="monotone" dataKey="total" stroke="hsl(211, 100%, 50%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(211, 100%, 50%)" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">No trend data yet</div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.map((a, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                        {a.user.split(" ").map((n: string) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{a.user}</p>
                        <p className="text-xs text-muted-foreground">{a.device} · {a.method}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${a.action === "Check-in" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                        {a.action}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">No recent activity</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
