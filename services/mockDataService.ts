
import { SystemData } from '../types';

// Browser API types for experimental features
interface NetworkInformation extends EventTarget {
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
  saveData?: boolean;
}

interface NavigatorWithMemory extends Navigator {
  deviceMemory?: number;
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

const nav = navigator as NavigatorWithMemory;
const win = window as any;

// --- CONFIGURATION: FALLBACK PROFILE ---
const STATIC_SPECS = {
  os: "CachyOS x86_64",
  host: "P53E (1.0)",
  kernel: "Linux 6.17.8-1-cachyos",
  cpuModel: "Intel(R) Core(TM) i3-2370M (4) @ 2.40 GHz",
  gpuModel: "Intel 2nd Gen Core Family Integrated Graphics",
  de: "KDE Plasma 6.5.3",
  wm: "KWin (Wayland)",
  shell: "fish 4.2.1",
  terminal: "konsole 25.8.3",
  resolution: '1366x768',
  ramTotal: 5.69,
  ip: "192.168.127.147/24",
  disks: [
    { path: "/", total: 931.51, used: 16.56, fs: "btrfs" },
  ]
};

export const REAL_CORES = nav.hardwareConcurrency || 4;
export const REAL_RAM_GB = STATIC_SPECS.ramTotal; 

// Initial Data State
let currentData: SystemData = {
  cpuUsage: Array(REAL_CORES).fill(10), 
  cpuTemp: 45,
  cpuName: STATIC_SPECS.cpuModel,
  ram: {
    total: REAL_RAM_GB,
    used: 3.00,
    available: 2.69,
  },
  storage: {
    total: STATIC_SPECS.disks.reduce((acc, disk) => acc + disk.total, 0),
    used: STATIC_SPECS.disks.reduce((acc, disk) => acc + disk.used, 0),
    disks: STATIC_SPECS.disks
  },
  network: {
    up: 0,
    down: 0,
    ip: STATIC_SPECS.ip
  },
  gpu: {
    name: STATIC_SPECS.gpuModel, 
    usage: 15,
    temp: 40,
  },
  osInfo: {
    platform: STATIC_SPECS.os,
    kernel: STATIC_SPECS.kernel,
    uptime: "2 hours, 7 mins",
    packages: "1281 (pacman)",
    shell: STATIC_SPECS.shell,
    resolution: STATIC_SPECS.resolution,
    de: STATIC_SPECS.de,
    wm: STATIC_SPECS.wm,
    theme: "Breeze (CachyOSNordLightly)",
    icons: "char-white",
    terminal: STATIC_SPECS.terminal
  }
};

const getNetworkBaseSpeed = () => {
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
  if (!connection) return { down: 10, up: 2 };
  const baseDown = connection.downlink || 10;
  return { down: baseDown, up: baseDown / 4 };
};

export const updateStorageEstimate = async () => {
  if (win.axonAPI && typeof win.axonAPI.getStorage === 'function') {
      try {
          const diskData = await win.axonAPI.getStorage();
          if (diskData) currentData.storage = diskData;
      } catch (e) { console.error("Bridge Error", e); }
  } else if (nav.storage && nav.storage.estimate) {
      // Browser fallback
      try {
        const estimate = await nav.storage.estimate();
        if (estimate.quota && estimate.usage) {
           const t = estimate.quota / 1073741824;
           const u = estimate.usage / 1073741824;
           currentData.storage.total = t;
           currentData.storage.used = u;
        }
      } catch (e) {}
  }
};

let startTime = Date.now() - (2 * 60 * 60 * 1000 + 7 * 60 * 1000);

export const getSimulatedSystemData = async (): Promise<SystemData> => {
  
  // --- DESKTOP BRIDGE (ELECTRON) ---
  if (win.axonAPI && typeof win.axonAPI.getStats === 'function') {
      try {
          const realStats = await win.axonAPI.getStats();
          if (realStats) {
             // Merge real stats with our data structure
             currentData.cpuUsage = realStats.cpuUsage || currentData.cpuUsage;
             currentData.cpuTemp = realStats.cpuTemp || currentData.cpuTemp;
             currentData.cpuName = realStats.cpuName || currentData.cpuName;
             currentData.ram = realStats.ram || currentData.ram;
             
             // Still simulate Network/GPU if bridge doesn't provide them yet
             const { down: maxDown, up: maxUp } = getNetworkBaseSpeed();
             currentData.network.down = navigator.onLine ? Math.random() * maxDown * 0.8 : 0;
             currentData.network.up = navigator.onLine ? Math.random() * maxUp * 0.5 : 0;
             
             // Update Uptime
             const now = Date.now();
             const diff = now - startTime;
             const hours = Math.floor(diff / (1000 * 60 * 60));
             const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
             currentData.osInfo.uptime = `${hours} hours, ${mins} mins`;

             return { ...currentData };
          }
      } catch (e) {
          console.error("Axon Bridge Failed, reverting to simulation", e);
      }
  }

  // --- BROWSER SIMULATION FALLBACK ---
  
  currentData.cpuUsage = currentData.cpuUsage.map(usage => {
    const change = (Math.random() - 0.5) * 15; 
    return Math.max(2, Math.min(100, usage + change));
  });

  const avgCpu = currentData.cpuUsage.reduce((a, b) => a + b, 0) / REAL_CORES;
  currentData.cpuTemp = 40 + (avgCpu * 0.4) + (Math.random() * 2);

  const ramFluctuation = (Math.random() - 0.5) * 0.05;
  currentData.ram.used = Math.max(1.5, Math.min(REAL_RAM_GB - 0.5, currentData.ram.used + ramFluctuation));
  currentData.ram.available = REAL_RAM_GB - currentData.ram.used;

  const { down: maxDown, up: maxUp } = getNetworkBaseSpeed();
  currentData.network.down = navigator.onLine ? Math.random() * maxDown * 0.8 : 0;
  currentData.network.up = navigator.onLine ? Math.random() * maxUp * 0.5 : 0;

  currentData.gpu.usage = Math.max(0, Math.min(100, currentData.gpu.usage + (Math.random() - 0.5) * 8));

  const now = Date.now();
  const diff = now - startTime;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  currentData.osInfo.uptime = `${hours} hours, ${mins} mins`;

  return { ...currentData };
};
