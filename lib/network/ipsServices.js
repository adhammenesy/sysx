"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpsServices = void 0;
const os_1 = __importDefault(require("os"));
const child_process_1 = require("child_process");
class IpsServices {
    /**
     * Get the local IPv4 address of the machine.
     * @returns {string} Local IP or "0.0.0.0" if not found.
     */
    static localIp() {
        const interfaces = os_1.default.networkInterfaces();
        if (!interfaces)
            return "0.0.0.0";
        for (const name of Object.keys(interfaces)) {
            const iface = interfaces[name];
            if (!iface)
                continue;
            for (const info of iface) {
                if (info.family === "IPv4" && !info.internal) {
                    return info.address;
                }
            }
        }
        return "0.0.0.0";
    }
    /**
     * Get the MAC address of the first non-internal IPv4 interface.
     * @returns {string} MAC address or "00:00:00:00:00:00" if not found.
     */
    static macAddress() {
        const interfaces = os_1.default.networkInterfaces();
        if (!interfaces)
            return "00:00:00:00:00:00";
        for (const name of Object.keys(interfaces)) {
            const iface = interfaces[name];
            if (!iface)
                continue;
            for (const info of iface) {
                if (info.family === "IPv4" && !info.internal) {
                    return info.mac;
                }
            }
        }
        return "00:00:00:00:00:00";
    }
    /**
     * Get the public IP of the machine using ipify API.
     * @returns {Promise<string>} Public IP or "unknown" if failed.
     */
    static async publicIp() {
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
     * Get all network interfaces with IP and MAC addresses.
     * @returns {Record<string, NetworkInterface>} Object with interface names as keys.
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
}
exports.IpsServices = IpsServices;
//# sourceMappingURL=ipsServices.js.map