import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, Users, Clock } from "lucide-react";

const mockLiveData = [
  { id: 1, user: "Sarah Johnson", action: "Check-in", device: "Main Entrance", time: "08:15:22", method: "card" },
  { id: 2, user: "Mike Chen", action: "Check-in", device: "Side Gate", time: "08:20:45", method: "fingerprint" },
  { id: 3, user: "Emily Davis", action: "Check-in", device: "Main Entrance", time: "08:22:10", method: "card" },
  { id: 4, user: "James Wilson", action: "Check-in", device: "Lab Door", time: "09:05:33", method: "backup_code" },
  { id: 5, user: "Aisha Patel", action: "Check-in", device: "Library", time: "09:10:12", method: "card" },
  { id: 6, user: "Robert Brown", action: "Check-in", device: "Parking Gate", time: "07:55:18", method: "card" },
];

const SharedDisplay = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Shared Display</h1>
          <p className="text-muted-foreground">Public attendance display for monitors</p>
        </div>
        <Badge variant="outline" className="text-sm gap-2 py-1.5 px-3">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          Live
        </Badge>
      </div>

      {/* Preview of shared display */}
      <Card className="glass-card overflow-hidden">
        <div className="gradient-primary-bold p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cpu className="w-8 h-8 text-primary-foreground" />
            <div>
              <h2 className="text-xl font-bold text-primary-foreground">TechCorp Academy</h2>
              <p className="text-primary-foreground/80 text-sm">Attendance Monitor</p>
            </div>
          </div>
          <div className="text-right text-primary-foreground">
            <p className="text-2xl font-bold font-mono">{time.toLocaleTimeString()}</p>
            <p className="text-sm text-primary-foreground/80">{time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
          </div>
        </div>

        <CardContent className="p-0">
          <div className="grid grid-cols-3 border-b border-border">
            <div className="p-4 text-center border-r border-border">
              <Users className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-2xl font-bold">867</p>
              <p className="text-xs text-muted-foreground">Checked In</p>
            </div>
            <div className="p-4 text-center border-r border-border">
              <Clock className="w-5 h-5 mx-auto mb-1 text-warning" />
              <p className="text-2xl font-bold">417</p>
              <p className="text-xs text-muted-foreground">Remaining</p>
            </div>
            <div className="p-4 text-center">
              <Cpu className="w-5 h-5 mx-auto mb-1 text-success" />
              <p className="text-2xl font-bold">5/6</p>
              <p className="text-xs text-muted-foreground">Devices Online</p>
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Recent Activity</h3>
            <div className="space-y-2">
              {mockLiveData.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {entry.user.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{entry.user}</p>
                      <p className="text-xs text-muted-foreground">{entry.device}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-success/10 text-success border-0 text-xs">{entry.action}</Badge>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">{entry.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground text-center">
        Share this page URL to display on public monitors. Data refreshes automatically.
      </p>
    </div>
  );
};

export default SharedDisplay;
