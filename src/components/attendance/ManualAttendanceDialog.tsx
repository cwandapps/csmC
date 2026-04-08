import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface ManualAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function ManualAttendanceDialog({ open, onOpenChange, onSuccess }: ManualAttendanceDialogProps) {
  const [saving, setSaving] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [form, setForm] = useState({
    userId: "", deviceId: "", method: "manual", status: "check_in", scheduleId: "", notes: "",
  });

  useEffect(() => {
    if (open) {
      Promise.all([api.getUsers(), api.getDevices(), api.getSchedules()])
        .then(([u, d, s]) => { setUsers(u || []); setDevices(d || []); setSchedules(s || []); })
        .catch(() => {});
      setForm({ userId: "", deviceId: "", method: "manual", status: "check_in", scheduleId: "", notes: "" });
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!form.userId || !form.deviceId) {
      toast.error("Please select a user and device");
      return;
    }
    setSaving(true);
    try {
      await api.createAttendance({
        userId: +form.userId,
        deviceId: +form.deviceId,
        method: form.method,
        status: form.status,
        notes: form.notes || undefined,
        scheduleId: form.scheduleId ? +form.scheduleId : undefined,
      });
      toast.success("Attendance recorded");
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to record attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Manual Attendance</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>User *</Label>
            <Select value={form.userId} onValueChange={v => setForm(f => ({ ...f, userId: v }))}>
              <SelectTrigger><SelectValue placeholder="Select user" /></SelectTrigger>
              <SelectContent>
                {users.map(u => (
                  <SelectItem key={u.id} value={String(u.id)}>
                    {u.first_name} {u.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Device *</Label>
            <Select value={form.deviceId} onValueChange={v => setForm(f => ({ ...f, deviceId: v }))}>
              <SelectTrigger><SelectValue placeholder="Select device" /></SelectTrigger>
              <SelectContent>
                {devices.map(d => (
                  <SelectItem key={d.id} value={String(d.id)}>{d.device_name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Method</Label>
              <Select value={form.method} onValueChange={v => setForm(f => ({ ...f, method: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="fingerprint">Fingerprint</SelectItem>
                  <SelectItem value="face_recognition">Face</SelectItem>
                  <SelectItem value="backup_code">Backup Code</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="check_in">Check In</SelectItem>
                  <SelectItem value="check_out">Check Out</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {schedules.length > 0 && (
            <div>
              <Label>Schedule (optional)</Label>
              <Select value={form.scheduleId} onValueChange={v => setForm(f => ({ ...f, scheduleId: v }))}>
                <SelectTrigger><SelectValue placeholder="None" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {schedules.map(s => (
                    <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional notes" rows={2} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving} className="gradient-primary-bold text-primary-foreground">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Record
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
