import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Pencil, Trash2, Users, CalendarDays } from "lucide-react";

interface Schedule {
  id: number;
  name: string;
  description?: string;
  type: string;
  start_time: string;
  end_time: string;
  days_of_week: string[];
  grace_minutes: number;
  late_threshold_minutes: number;
  target_type: string;
  is_active: boolean;
}

interface ScheduleCardProps {
  schedule: Schedule;
  onEdit: (schedule: Schedule) => void;
  onDelete: (schedule: Schedule) => void;
}

const dayLabels: Record<string, string> = {
  monday: "Mon", tuesday: "Tue", wednesday: "Wed",
  thursday: "Thu", friday: "Fri", saturday: "Sat", sunday: "Sun"
};

const allDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

export default function ScheduleCard({ schedule, onEdit, onDelete }: ScheduleCardProps) {
  const days = Array.isArray(schedule.days_of_week)
    ? schedule.days_of_week
    : typeof schedule.days_of_week === "string"
      ? JSON.parse(schedule.days_of_week)
      : [];

  return (
    <Card className="glass-card hover:border-primary/30 transition-colors">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">{schedule.name}</h4>
            {schedule.description && (
              <p className="text-xs text-muted-foreground line-clamp-1">{schedule.description}</p>
            )}
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(schedule)}>
              <Pencil className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete(schedule)}>
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{schedule.start_time?.slice(0, 5)} – {schedule.end_time?.slice(0, 5)}</span>
          </div>
          <Badge variant="outline" className="text-[10px] capitalize">{schedule.type}</Badge>
          {!schedule.is_active && <Badge variant="secondary" className="text-[10px]">Inactive</Badge>}
        </div>

        <div className="flex gap-1">
          {allDays.map((d) => (
            <span
              key={d}
              className={`text-[10px] w-7 h-5 flex items-center justify-center rounded ${
                days.includes(d) ? "bg-primary text-primary-foreground font-medium" : "bg-muted text-muted-foreground"
              }`}
            >
              {dayLabels[d]}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="w-3 h-3" />
          <span className="capitalize">{schedule.target_type?.replace("_", " ")}</span>
          {schedule.grace_minutes > 0 && (
            <>
              <span>•</span>
              <span>{schedule.grace_minutes}min grace</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
