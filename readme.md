> [![npm version](https://img.shields.io/npm/v/sysx.svg)](https://www.npmjs.com/package/sysx)
> [![npm downloads](https://img.shields.io/npm/dm/sysx.svg)](https://www.npmjs.com/package/sysx)
> [![Discord](https://img.shields.io/badge/Discord-Join%20Us-7289DA?logo=discord\&logoColor=white)](https://discord.gg/Epe2t7YWqq)
````markdown
# sysx

`sysx` is a Node.js utility package to fetch system and network information in a simple and TypeScript-friendly way. It provides OS info, CPU, RAM, disk info, network interfaces, local and public IP, and more.

## Installation

```bash
npm install sysx
````

or with Yarn:

```bash
yarn add sysx
```

## Features

* Get local IPv4 address and MAC address.
* Get public IP address.
* Fetch all network interfaces with IP and MAC.
* Retrieve OS info: platform, architecture, hostname, uptime.
* Get CPU info: name, cores, max clock speed.
* RAM info (total, free).
* Disk info (Windows and Unix-like).
* Clipboard read/write (OS-specific).
* Security info (current user, open ports, admin status).

## Usage

```ts
import { IpsServices, OSServices } from "sysx";

// Network
const localIp = IpsServices.localIp();
const mac = IpsServices.macAddress();
const publicIp = await IpsServices.publicIp();
const networkInterfaces = IpsServices.getNetworkInterfaces();

// OS
const osInfo = OSServices.getOSInfo();
const cpuInfo = OSServices.getCPUInfo();
const ramInfo = OSServices.getRAMInfo();
const disks = OSServices.getDisks();
const system = await OSServices.systemInfo();

console.log({ localIp, mac, publicIp, networkInterfaces });
console.log({ osInfo, cpuInfo, ramInfo, disks, system });
```

## API

### `IpsServices`

* `localIp(): string` – Returns the local IPv4 address.
* `macAddress(): string` – Returns the MAC address.
* `publicIp(): Promise<string>` – Returns the public IP.
* `getNetworkInterfaces(): Record<string, { ip: string; mac: string }>` – Returns all network interfaces.

### `OSServices`

* `getOSInfo(): OSInfo` – Returns platform, architecture, hostname, uptime.
* `getCPUInfo(): CPUInfo` – Returns CPU name, cores, max clock speed.
* `getRAMInfo(): RAMInfo` – Returns total/free memory.
* `getDisks(): DiskInfo[]` – Returns disk info.
* `systemInfo(): Promise<SystemInfo>` – Returns combined system info including CPU, RAM, network, OS, public IP, and disks.

## Types

`sysx` is fully TypeScript-ready. Interfaces include:

* `NetworkInterface`
* `OSInfo`
* `CPUInfo`
* `RAMInfo`
* `DiskInfo`
* `SystemInfo`