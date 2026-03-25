import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Wifi, WifiOff, Cpu, Pencil, Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface DeviceForm {
  deviceName: string;
  uniqueDeviceId: string;
  deviceType: string;
  status: string;
}

const emptyForm: DeviceForm = { deviceName: "", uniqueDeviceId: "", deviceType: "ESP32", status: "active" };

const DevicesPage = () => {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [form, setForm] = useState<DeviceForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const data = await api.getDevices();
      setDevices(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load devices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDevices(); }, []);

  const online = devices.filter(d => d.is_online).length;

  const openCreate = () => { setEditingDevice(null); setForm(emptyForm); setModalOpen(true); };

  const openEdit = (d: any) => {
    setEditingDevice(d);
    setForm({
      deviceName: d.device_name || "",
      uniqueDeviceId: d.unique_device_id || "",
      deviceType: d.device_type || "ESP32",
      status: d.status || "active",
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.deviceName || !form.uniqueDeviceId || !form.deviceType) {
      toast.error("All fields are required");
      return;
    }
    setSaving(true);
    try {
      if (editingDevice) {
        await api.updateDevice(editingDevice.id, form);
        toast.success("Device updated");
      } else {
        await api.createDevice(form);
        toast.success("Device created");
      }
      setModalOpen(false);
      fetchDevices();
    } catch (err: any) {
      toast.error(err.message || "Failed to save device");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.deleteDevice(deleteTarget.id);
      toast.success("Device deleted");
      fetchDevices();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete device");
    } finally {
      setDeleteOpen(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Devices</h1>
          <p className="text-muted-foreground">{online} of {devices.length} devices online</p>
        </div>
        <Button size="sm" className="gradient-primary-bold text-primary-foreground" onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />Add Device
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
      ) : devices.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">No devices found. Click "Add Device" to register one.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device, i) => (
            <motion.div key={device.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="glass-card hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex items-center gap-1">
                      {device.is_online ? (
                        <Badge className="bg-success/10 text-success border-0 gap-1"><Wifi className="w-3 h-3" />Online</Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1"><WifiOff className="w-3 h-3" />Offline</Badge>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(device)}>
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { setDeleteTarget(device); setDeleteOpen(true); }}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1">{device.device_name}</h3>
                  <p className="text-xs text-muted-foreground font-mono mb-3">{device.unique_device_id}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">{device.device_type}</Badge>
                    <Badge variant={device.status === "active" ? "default" : "destructive"} className={device.status === "active" ? "bg-success/10 text-success border-0 text-xs" : "text-xs"}>
                      {device.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDevice ? "Edit Device" : "Add New Device"}</DialogTitle>
            <DialogDescription>Enter the device details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Device Name *</Label>
              <Input value={form.deviceName} onChange={(e) => setForm({ ...form, deviceName: e.target.value })} placeholder="e.g. Main Entrance Scanner" />
            </div>
            <div className="space-y-2">
              <Label>Unique Device ID *</Label>
              <Input value={form.uniqueDeviceId} onChange={(e) => setForm({ ...form, uniqueDeviceId: e.target.value })} placeholder="e.g. DEV-001-ESP32" className="font-mono" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Device Type *</Label>
                <Select value={form.deviceType} onValueChange={(v) => setForm({ ...form, deviceType: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ESP32">ESP32</SelectItem>
                    <SelectItem value="ESP8266">ESP8266</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button className="gradient-primary-bold text-primary-foreground" onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {editingDevice ? "Save Changes" : "Create Device"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Device</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.device_name}"? This will also remove all associated attendance records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DevicesPage;
