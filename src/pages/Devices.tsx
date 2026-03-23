import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Wifi, WifiOff, MapPin, Cpu } from "lucide-react";
import { motion } from "framer-motion";

const mockDevices = [
  { id: 1, name: "Main Entrance Scanner", type: "ESP32", uniqueId: "DEV-001-ESP32", status: "active", isOnline: true, lastSeen: "Just now", location: "Building A - Main Gate" },
  { id: 2, name: "Side Gate Reader", type: "ESP32", uniqueId: "DEV-002-ESP32", status: "active", isOnline: true, lastSeen: "1 min ago", location: "Building A - Side Gate" },
  { id: 3, name: "Lab Door Access", type: "ESP8266", uniqueId: "DEV-003-ESP86", status: "active", isOnline: false, lastSeen: "2 hours ago", location: "Building B - Lab 101" },
  { id: 4, name: "Library Entrance", type: "ESP32", uniqueId: "DEV-004-ESP32", status: "active", isOnline: true, lastSeen: "Just now", location: "Building C - Library" },
  { id: 5, name: "Cafeteria Scanner", type: "ESP8266", uniqueId: "DEV-005-ESP86", status: "inactive", isOnline: false, lastSeen: "3 days ago", location: "Building A - Cafeteria" },
  { id: 6, name: "Parking Gate", type: "ESP32", uniqueId: "DEV-006-ESP32", status: "active", isOnline: true, lastSeen: "Just now", location: "Parking Lot" },
];

const DevicesPage = () => {
  const online = mockDevices.filter(d => d.isOnline).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Devices</h1>
          <p className="text-muted-foreground">{online} of {mockDevices.length} devices online</p>
        </div>
        <Button size="sm" className="gradient-primary-bold text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />Add Device
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockDevices.map((device, i) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="glass-card hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    {device.isOnline ? (
                      <Badge className="bg-success/10 text-success border-0 gap-1"><Wifi className="w-3 h-3" />Online</Badge>
                    ) : (
                      <Badge variant="secondary" className="gap-1"><WifiOff className="w-3 h-3" />Offline</Badge>
                    )}
                  </div>
                </div>

                <h3 className="font-semibold mb-1">{device.name}</h3>
                <p className="text-xs text-muted-foreground font-mono mb-3">{device.uniqueId}</p>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{device.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">{device.type}</Badge>
                    <span className="text-xs">Last: {device.lastSeen}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DevicesPage;
