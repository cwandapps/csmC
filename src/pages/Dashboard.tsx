import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Cpu, ClipboardList, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { motion } from "framer-motion";

const stats = [
  { label: "Total Users", value: "1,284", change: "+12%", up: true, icon: Users },
  { label: "Active Devices", value: "24", change: "+3", up: true, icon: Cpu },
  { label: "Today's Check-ins", value: "867", change: "+5.2%", up: true, icon: ClipboardList },
  { label: "Attendance Rate", value: "94.2%", change: "-0.8%", up: false, icon: TrendingUp },
];

const weeklyData = [
  { day: "Mon", checkIns: 845, checkOuts: 830 },
  { day: "Tue", checkIns: 920, checkOuts: 905 },
  { day: "Wed", checkIns: 890, checkOuts: 875 },
  { day: "Thu", checkIns: 910, checkOuts: 895 },
  { day: "Fri", checkIns: 867, checkOuts: 850 },
  { day: "Sat", checkIns: 340, checkOuts: 330 },
  { day: "Sun", checkIns: 120, checkOuts: 115 },
];

const monthlyTrend = [
  { month: "Jan", rate: 91 }, { month: "Feb", rate: 89 }, { month: "Mar", rate: 93 },
  { month: "Apr", rate: 92 }, { month: "May", rate: 95 }, { month: "Jun", rate: 94.2 },
];

const methodData = [
  { name: "Card", value: 65 },
  { name: "Fingerprint", value: 25 },
  { name: "Backup Code", value: 10 },
];

const CHART_COLORS = ["hsl(211, 100%, 50%)", "hsl(227, 67%, 70%)", "hsl(224, 40%, 80%)"];

const recentActivity = [
  { user: "Sarah Johnson", action: "Check-in", device: "Main Entrance", time: "2 min ago", method: "card" },
  { user: "Mike Chen", action: "Check-out", device: "Side Gate", time: "5 min ago", method: "fingerprint" },
  { user: "Emily Davis", action: "Check-in", device: "Lab Door", time: "12 min ago", method: "card" },
  { user: "James Wilson", action: "Check-in", device: "Main Entrance", time: "15 min ago", method: "backup_code" },
  { user: "Aisha Patel", action: "Check-out", device: "Main Entrance", time: "20 min ago", method: "card" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your attendance system</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
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
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Auth Methods</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={methodData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                  {methodData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              {methodData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[i] }} />
                  <span className="text-muted-foreground">{d.name} {d.value}%</span>
                </div>
              ))}
            </div>
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
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(224, 20%, 88%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis domain={[85, 100]} tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <Tooltip />
                <Line type="monotone" dataKey="rate" stroke="hsl(211, 100%, 50%)" strokeWidth={2} dot={{ r: 4, fill: "hsl(211, 100%, 50%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {a.user.split(" ").map(n => n[0]).join("")}
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
