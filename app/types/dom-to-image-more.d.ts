declare module 'dom-to-image-more' {
  interface DomToImageOptions {
    quality?: number;
    width?: number;
    height?: number;
    style?: Record<string, string>;
    bgcolor?: string;
    filter?: (node: HTMLElement) => boolean;
  }

  const domtoimage: {
    toPng(node: HTMLElement, options?: DomToImageOptions): Promise<string>;
  };

  export = domtoimage;
} 