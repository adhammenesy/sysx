export interface NetworkInterface {
    ip: string;
    mac: string;
}
export declare class IpsServices {
    /**
     * Get the local IPv4 address of the machine.
     * @returns {string} Local IP or "0.0.0.0" if not found.
     */
    static localIp(): string;
    /**
     * Get the MAC address of the first non-internal IPv4 interface.
     * @returns {string} MAC address or "00:00:00:00:00:00" if not found.
     */
    static macAddress(): string;
    /**
     * Get the public IP of the machine using ipify API.
     * @returns {Promise<string>} Public IP or "unknown" if failed.
     */
    static publicIp(): Promise<string>;
    /**
     * Get all network interfaces with IP and MAC addresses.
     * @returns {Record<string, NetworkInterface>} Object with interface names as keys.
     */
    static getNetworkInterfaces(): Record<string, NetworkInterface>;
}
//# sourceMappingURL=ipsServices.d.ts.map