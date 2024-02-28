interface IWindowManagerCtx {
  openWindows: string[];
  isOpen: (key: string) => boolean;
  open: (key: string) => void;
  close: (key: string) => void;
  toggle: (key: string) => void;
  closeAll: () => void;
}

export default IWindowManagerCtx;