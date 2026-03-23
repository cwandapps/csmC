import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Download, Calendar } from "lucide-react";

const mockAttendance = [
  { id: 1, user: "Sarah Johnson", role: "student", device: "Main Entrance", method: "card", status: "check_in", time: "2026-03-23 08:15:22" },
  { id: 2, user: "Mike Chen", role: "employee", device: "Side Gate", method: "fingerprint", status: "check_in", time: "2026-03-23 08:20:45" },
  { id: 3, user: "Emily Davis", role: "student", device: "Main Entrance", method: "card", status: "check_in", time: "2026-03-23 08:22:10" },
  { id: 4, user: "Sarah Johnson", role: "student", device: "Main Entrance", method: "card", status: "check_out", time: "2026-03-23 15:30:00" },
  { id: 5, user: "James Wilson", role: "employee", device: "Lab Door", method: "backup_code", status: "check_in", time: "2026-03-23 09:05:33" },
  { id: 6, user: "Aisha Patel", role: "student", device: "Library", method: "card", status: "check_in", time: "2026-03-23 09:10:12" },
  { id: 7, user: "Mike Chen", role: "employee", device: "Side Gate", method: "fingerprint", status: "check_out", time: "2026-03-23 17:05:00" },
  { id: 8, user: "Robert Brown", role: "employee", device: "Parking Gate", method: "card", status: "check_in", time: "2026-03-23 07:55:18" },
];

const AttendancePage = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockAttendance.filter((a) => {
    const matchSearch = a.user.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Attendance</h1>
          <p className="text-muted-foreground">Today's attendance records</p>
        </div>
        <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export CSV</Button>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="check_in">Check-in</SelectItem>
                <SelectItem value="check_out">Check-out</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden sm:table-cell">Device</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{a.user}</p>
                      <p className="text-xs text-muted-foreground capitalize">{a.role}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{a.device}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs capitalize">{a.method.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={a.status === "check_in" ? "bg-success/10 text-success border-0" : "bg-warning/10 text-warning border-0"}>
                      {a.status === "check_in" ? "In" : "Out"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {new Date(a.time).toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendancePage;
