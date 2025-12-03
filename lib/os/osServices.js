"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OSServices = void 0;
const child_process_1 = require("child_process");
class OSServices {
    /**
     * Converts uptime in seconds to a readable string
     */
    static formatUptime(uptimeSec) {
        if (uptimeSec < 60 * 60)
            return `${Math.floor(uptimeSec / 60)}m`;
        else if (uptimeSec < 24 * 60 * 60)
            return `${Math.floor(uptimeSec / 3600)}h`;
        else
            return `${Math.floor(uptimeSec / (24 * 3600))}d`;
    }
    /**
     * Returns OS information
     */
    static getOSInfo() {
        const platform = process.platform;
        let arch = "unknown";
        let hostname = "unknown";
        let uptimeSec = 0;
        try {
            arch = platform === "win32"
                ? (0, child_process_1.execSync)("echo %PROCESSOR_ARCHITECTURE%").toString().trim()
                : (0, child_process_1.execSync)("uname -m").toString().trim();
            hostname = (0, child_process_1.execSync)("hostname").toString().trim();
            if (platform === "win32") {
                const output = (0, child_process_1.execSync)('systeminfo').toString();
                const uptimeMatch = output.match(/System Boot Time:\s+(.+)/);
                if (uptimeMatch) {
                    const bootDate = new Date(uptimeMatch[1]);
                    uptimeSec = Math.floor((Date.now() - bootDate.getTime()) / 1000);
                }
            }
            else {
                const output = (0, child_process_1.execSync)("cat /proc/uptime").toString().split(" ");
                uptimeSec = Math.floor(parseFloat(output[0]));
            }
        }
        catch { }
        return { platform, arch, hostname, uptime: this.formatUptime(uptimeSec) };
    }
    /**
     * Returns CPU information
     */
    static getCPUInfo() {
        try {
            const platform = process.platform;
            if (platform === "win32") {
                const output = (0, child_process_1.execSync)("wmic cpu get Name,NumberOfCores,MaxClockSpeed /format:csv").toString().trim();
                const lines = output.split(/\r?\n/).filter(Boolean);
                if (lines.length >= 2) {
                    const values = lines[1].split(",");
                    return { name: values[2].trim(), cores: parseInt(values[3]), maxClockSpeed: parseInt(values[1]) };
                }
            }
            else {
                const output = (0, child_process_1.execSync)("lscpu").toString();
                const getValue = (key) => {
                    const match = output.match(new RegExp(`${key}:\\s+(.+)`));
                    return match ? match[1].trim() : "unknown";
                };
                return { name: getValue("Model name"), cores: parseInt(getValue("CPU(s)")), maxClockSpeed: parseInt(getValue("CPU max MHz")) };
            }
        }
        catch { }
        return { name: "unknown", cores: 0, maxClockSpeed: 0 };
    }
    /**
     * Returns RAM information
     */
    static getRAMInfo() {
        try {
            const platform = process.platform;
            if (platform === "win32") {
                const totalRaw = (0, child_process_1.execSync)('wmic ComputerSystem get TotalPhysicalMemory /value').toString();
                const match = totalRaw.match(/TotalPhysicalMemory=(\d+)/);
                return { total: match ? parseInt(match[1]) : 0 };
            }
            else {
                const memTotal = (0, child_process_1.execSync)("grep MemTotal /proc/meminfo").toString();
                const memFree = (0, child_process_1.execSync)("grep MemFree /proc/meminfo").toString();
                const total = parseInt(memTotal.match(/\d+/)?.[0] || "0") * 1024;
                const free = parseInt(memFree.match(/\d+/)?.[0] || "0") * 1024;
                return { total, free };
            }
        }
        catch {
            return { total: 0, free: 0 };
        }
    }
    /**
     * Returns network interfaces
     */
    static getNetworkInterfaces() {
        const result = {};
        try {
            const platform = process.platform;
            let output = "";
            if (platform === "win32") {
                output = (0, child_process_1.execSync)("ipconfig /all").toString();
                const sections = output.split(/\r?\n\r?\n/);
                sections.forEach(sec => {
                    const nameMatch = sec.match(/^(.+):/);
                    if (nameMatch) {
                        const ipMatch = sec.match(/IPv4 Address[.\s]*: ([0-9.]+)/);
                        const macMatch = sec.match(/Physical Address[.\s]*: ([0-9A-F-]+)/i);
                        if (ipMatch && macMatch)
                            result[nameMatch[1].trim()] = { ip: ipMatch[1], mac: macMatch[1] };
                    }
                });
            }
            else {
                output = (0, child_process_1.execSync)("ip addr").toString();
                const blocks = output.split(/\n\d+: /);
                blocks.forEach(blk => {
                    const nameMatch = blk.match(/^(\S+):/);
                    if (nameMatch) {
                        const ipMatch = blk.match(/inet (\d+\.\d+\.\d+\.\d+)/);
                        const macMatch = blk.match(/ether ([0-9a-fA-F:]+)/);
                        if (ipMatch && macMatch)
                            result[nameMatch[1]] = { ip: ipMatch[1], mac: macMatch[1] };
                    }
                });
            }
        }
        catch { }
        return result;
    }
    /**
     * Returns current user info
     */
    static getUserInfo() {
        try {
            return { username: (0, child_process_1.execSync)("whoami").toString().trim() };
        }
        catch {
            return { username: "unknown" };
        }
    }
    /**
     * Returns public IP via fetch
     */
    static async getPublicIP() {
        try {
            const res = await fetch("https://api.ipify.org?format=json");
            const data = await res.json();
            return data.ip || "unknown";
        }
        catch {
            return "unknown";
        }
    }
    /**
     * Returns disk info
     */
    static getDisks() {
        try {
            const platform = process.platform;
            if (platform === "win32") {
                const output = (0, child_process_1.execSync)('wmic logicaldisk get Caption,FreeSpace,Size /format:csv').toString().trim();
                const lines = output.split(/\r?\n/).filter(Boolean);
                const disks = [];
                for (let i = 1; i < lines.length; i++) {
                    const [node, caption, free, size] = lines[i].split(",");
                    disks.push({ drive: caption, free: parseInt(free), size: parseInt(size) });
                }
                return disks;
            }
            else {
                return (0, child_process_1.execSync)('df -h').toString();
            }
        }
        catch {
            return [];
        }
    }
    /**
     * Returns full system info
     */
    static async systemInfo() {
        return {
            os: this.getOSInfo(),
            cpu: this.getCPUInfo(),
            ram: this.getRAMInfo(),
            network: this.getNetworkInterfaces(),
            user: this.getUserInfo(),
            disks: this.getDisks(),
            publicIP: await this.getPublicIP()
        };
    }
}
exports.OSServices = OSServices;
//# sourceMappingURL=osServices.js.map