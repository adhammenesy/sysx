export interface OSInfo {
    platform: string;
    arch: string;
    hostname: string;
    uptime: string;
}
export interface CPUInfo {
    name: string;
    cores: number;
    maxClockSpeed: number;
}
export interface RAMInfo {
    total: number;
    free?: number;
}
export interface NetworkInterface {
    ip: string;
    mac: string;
}
export interface UserInfo {
    username: string;
}
export interface DiskInfo {
    drive: string;
    free: number;
    size: number;
}
export interface SystemInfo {
    os: OSInfo;
    cpu: CPUInfo;
    ram: RAMInfo;
    network: Record<string, NetworkInterface>;
    user: UserInfo;
    disks: DiskInfo[] | string;
    publicIP: string;
}
export declare class OSServices {
    /**
     * Converts uptime in seconds to a readable string
     */
    static formatUptime(uptimeSec: number): string;
    /**
     * Returns OS information
     */
    static getOSInfo(): OSInfo;
    /**
     * Returns CPU information
     */
    static getCPUInfo(): CPUInfo;
    /**
     * Returns RAM information
     */
    static getRAMInfo(): RAMInfo;
    /**
     * Returns network interfaces
     */
    static getNetworkInterfaces(): Record<string, NetworkInterface>;
    /**
     * Returns current user info
     */
    static getUserInfo(): UserInfo;
    /**
     * Returns public IP via fetch
     */
    static getPublicIP(): Promise<string>;
    /**
     * Returns disk info
     */
    static getDisks(): DiskInfo[] | string;
    /**
     * Returns full system info
     */
    static systemInfo(): Promise<SystemInfo>;
}
//# sourceMappingURL=osServices.d.ts.map