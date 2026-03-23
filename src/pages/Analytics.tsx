import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts";
import { useState } from "react";

const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  checkIns: i >= 7 && i <= 9 ? Math.floor(Math.random() * 200 + 100) : i >= 16 && i <= 18 ? Math.floor(Math.random() * 150 + 50) : Math.floor(Math.random() * 30),
}));

const weeklyComparison = [
  { week: "W1", students: 420, employees: 180 },
  { week: "W2", students: 450, employees: 190 },
  { week: "W3", students: 430, employees: 175 },
  { week: "W4", students: 460, employees: 195 },
];

const deviceUsage = [
  { device: "Main Entrance", scans: 3420 },
  { device: "Side Gate", scans: 1890 },
  { device: "Lab Door", scans: 1250 },
  { device: "Library", scans: 980 },
  { device: "Cafeteria", scans: 750 },
  { device: "Parking", scans: 620 },
];

const monthlyData = [
  { month: "Oct", total: 18500 },
  { month: "Nov", total: 19200 },
  { month: "Dec", total: 15800 },
  { month: "Jan", total: 20100 },
  { month: "Feb", total: 21400 },
  { month: "Mar", total: 19800 },
];

const AnalyticsPage = () => {
  const [period, setPeriod] = useState("month");

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
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(224, 20%, 88%)" />
                <XAxis dataKey="hour" tick={{ fontSize: 10 }} stroke="hsl(220, 10%, 46%)" interval={3} />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <Tooltip />
                <Area type="monotone" dataKey="checkIns" stroke="hsl(211, 100%, 50%)" fill="hsl(211, 100%, 50%)" fillOpacity={0.15} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Weekly by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={weeklyComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(224, 20%, 88%)" />
                <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <Tooltip />
                <Bar dataKey="students" fill="hsl(211, 100%, 50%)" radius={[6, 6, 0, 0]} name="Students" />
                <Bar dataKey="employees" fill="hsl(227, 67%, 80%)" radius={[6, 6, 0, 0]} name="Employees" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Device Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={deviceUsage} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(224, 20%, 88%)" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis type="category" dataKey="device" tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 46%)" width={100} />
                <Tooltip />
                <Bar dataKey="scans" fill="hsl(211, 100%, 50%)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-base">Monthly Total Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(224, 20%, 88%)" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 46%)" />
                <Tooltip />
                <Line type="monotone" dataKey="total" stroke="hsl(211, 100%, 50%)" strokeWidth={2.5} dot={{ r: 5, fill: "hsl(211, 100%, 50%)" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
