export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  "card-foreground": string;
  popover: string;
  "popover-foreground": string;
  primary: string;
  "primary-foreground": string;
  secondary: string;
  "secondary-foreground": string;
  muted: string;
  "muted-foreground": string;
  accent: string;
  "accent-foreground": string;
  destructive: string;
  "destructive-foreground": string;
  border: string;
  input: string;
  ring: string;
  radius?: string;
  "font-sans"?: string;
  "font-serif"?: string;
  "font-mono"?: string;
  [key: string]: string | undefined;
}

export interface ThemePreset {
  label: string;
  createdAt?: string;
  styles: {
    light: ThemeColors;
    dark: ThemeColors;
  };
}