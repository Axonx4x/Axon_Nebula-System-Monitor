export interface SystemData {
  cpuUsage: number[]; // Usage per core
  cpuTemp: number;
  cpuName: string;
  ram: {
    total: number;
    used: number;
    available: number;
  };
  storage: {
    total: number;
    used: number;
    disks: {
      path: string;
      total: number;
      used: number;
      fs: string;
    }[];
  };
  network: {
    up: number;
    down: number;
    ip: string;
  };
  gpu: {
    name: string;
    usage: number;
    temp: number;
  };
  osInfo: {
    platform: string; // OS Name
    kernel: string;
    uptime: string;
    packages: string;
    shell: string;
    resolution: string;
    de: string;
    wm: string;
    theme: string;
    icons: string;
    terminal: string;
  };
}

export interface BatteryStatus {
  charging: boolean;
  level: number;
  chargingTime: number;
  dischargingTime: number;
}

// Extend Navigator for experimental Battery API
export interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

export interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  onchargingchange: EventListenerOrEventListenerObject | null;
  onchargingtimechange: EventListenerOrEventListenerObject | null;
  ondischargingtimechange: EventListenerOrEventListenerObject | null;
  onlevelchange: EventListenerOrEventListenerObject | null;
}

export interface MediaItem {
  id: string;
  file: File;
  url: string;
  type: 'image' | 'video' | 'audio';
}
