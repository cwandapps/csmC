import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

const allDays = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: any) => Promise<void>;
  schedule?: any;
}

export default function ScheduleDialog({ open, onOpenChange, onSave, schedule }: ScheduleDialogProps) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "both" as string,
    start_time: "08:00",
    end_time: "17:00",
    days_of_week: ["monday", "tuesday", "wednesday", "thursday", "friday"] as string[],
    grace_minutes: 0,
    late_threshold_minutes: 15,
    early_leave_threshold_minutes: 15,
    target_type: "all" as string,
    is_active: true,
  });

  useEffect(() => {
    if (schedule) {
      const days = Array.isArray(schedule.days_of_week)
        ? schedule.days_of_week
        : typeof schedule.days_of_week === "string"
          ? JSON.parse(schedule.days_of_week)
          : ["monday", "tuesday", "wednesday", "thursday", "friday"];
      setForm({
        name: schedule.name || "",
        description: schedule.description || "",
        type: schedule.type || "both",
        start_time: schedule.start_time?.slice(0, 5) || "08:00",
        end_time: schedule.end_time?.slice(0, 5) || "17:00",
        days_of_week: days,
        grace_minutes: schedule.grace_minutes || 0,
        late_threshold_minutes: schedule.late_threshold_minutes || 15,
        early_leave_threshold_minutes: schedule.early_leave_threshold_minutes || 15,
        target_type: schedule.target_type || "all",
        is_active: schedule.is_active !== false,
      });
    } else {
      setForm({
        name: "", description: "", type: "both", start_time: "08:00", end_time: "17:00",
        days_of_week: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        grace_minutes: 0, late_threshold_minutes: 15, early_leave_threshold_minutes: 15,
        target_type: "all", is_active: true,
      });
    }
  }, [schedule, open]);

  const toggleDay = (day: string) => {
    setForm(f => ({
      ...f,
      days_of_week: f.days_of_week.includes(day)
        ? f.days_of_week.filter(d => d !== day)
        : [...f.days_of_week, day],
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await onSave(form);
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{schedule ? "Edit Schedule" : "New Schedule"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Schedule Name *</Label>
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Morning Shift" />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description" rows={2} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Type</Label>
              <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Check-in & Out</SelectItem>
                  <SelectItem value="check_in">Check-in Only</SelectItem>
                  <SelectItem value="check_out">Check-out Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Target</Label>
              <Select value={form.target_type} onValueChange={v => setForm(f => ({ ...f, target_type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="departments">Departments</SelectItem>
                  <SelectItem value="positions">Positions</SelectItem>
                  <SelectItem value="sections">Sections</SelectItem>
                  <SelectItem value="classes">Classes</SelectItem>
                  <SelectItem value="specific_users">Specific Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Start Time</Label>
              <Input type="time" value={form.start_time} onChange={e => setForm(f => ({ ...f, start_time: e.target.value }))} />
            </div>
            <div>
              <Label>End Time</Label>
              <Input type="time" value={form.end_time} onChange={e => setForm(f => ({ ...f, end_time: e.target.value }))} />
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Days of Week</Label>
            <div className="flex flex-wrap gap-2">
              {allDays.map(d => (
                <label key={d.value} className="flex items-center gap-1.5 cursor-pointer">
                  <Checkbox checked={form.days_of_week.includes(d.value)} onCheckedChange={() => toggleDay(d.value)} />
                  <span className="text-sm">{d.label.slice(0, 3)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Grace (min)</Label>
              <Input type="number" min={0} value={form.grace_minutes} onChange={e => setForm(f => ({ ...f, grace_minutes: +e.target.value }))} />
            </div>
            <div>
              <Label>Late (min)</Label>
              <Input type="number" min={0} value={form.late_threshold_minutes} onChange={e => setForm(f => ({ ...f, late_threshold_minutes: +e.target.value }))} />
            </div>
            <div>
              <Label>Early Leave (min)</Label>
              <Input type="number" min={0} value={form.early_leave_threshold_minutes} onChange={e => setForm(f => ({ ...f, early_leave_threshold_minutes: +e.target.value }))} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving || !form.name.trim()} className="gradient-primary-bold text-primary-foreground">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {schedule ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
