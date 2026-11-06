/**
 * Electron Preload Script
 * Exposes safe, sandboxed IPC bridge APIs to the renderer process without exposing raw Node.
 */

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getSmartSpectraStatus: () => ipcRenderer.invoke('smartspectra:getStatus'),
  onStreamEvent: (callback: (data: unknown) => void) => {
    ipcRenderer.on('smartspectra:stream', (_event, value) => callback(value));
  },
});
