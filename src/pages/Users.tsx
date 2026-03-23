import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, Download, Filter } from "lucide-react";

const mockUsers = [
  { id: 1, firstName: "Sarah", lastName: "Johnson", email: "sarah@org.com", role: "student", cardUid: "A1B2C3D4", isActive: true, className: "Grade 10", department: null },
  { id: 2, firstName: "Mike", lastName: "Chen", email: "mike@org.com", role: "employee", cardUid: "E5F6G7H8", isActive: true, className: null, department: "Engineering" },
  { id: 3, firstName: "Emily", lastName: "Davis", email: "emily@org.com", role: "student", cardUid: "I9J0K1L2", isActive: true, className: "Grade 11", department: null },
  { id: 4, firstName: "James", lastName: "Wilson", email: "james@org.com", role: "employee", cardUid: "M3N4O5P6", isActive: false, className: null, department: "HR" },
  { id: 5, firstName: "Aisha", lastName: "Patel", email: "aisha@org.com", role: "student", cardUid: "Q7R8S9T0", isActive: true, className: "Grade 12", department: null },
  { id: 6, firstName: "Robert", lastName: "Brown", email: "robert@org.com", role: "employee", cardUid: null, isActive: true, className: null, department: "Marketing" },
];

const UsersPage = () => {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = mockUsers.filter((u) => {
    const matchSearch = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage students and employees</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Export</Button>
          <Button size="sm" className="gradient-primary-bold text-primary-foreground"><Plus className="w-4 h-4 mr-2" />Add User</Button>
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10" />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40 h-10">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="employee">Employees</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Card UID</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                        {u.firstName[0]}{u.lastName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{u.firstName} {u.lastName}</p>
                        <p className="text-xs text-muted-foreground sm:hidden">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize text-xs">{u.role}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground font-mono">
                    {u.cardUid || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.isActive ? "default" : "destructive"} className={u.isActive ? "bg-success/10 text-success hover:bg-success/20 border-0" : ""}>
                      {u.isActive ? "Active" : "Inactive"}
                    </Badge>
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

export default UsersPage;
