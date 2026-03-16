function IconBase({ children, className = 'h-5 w-5', strokeWidth = 1.8 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function SparkIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 2v5" />
      <path d="M12 17v5" />
      <path d="m4.9 4.9 3.5 3.5" />
      <path d="m15.6 15.6 3.5 3.5" />
      <path d="M2 12h5" />
      <path d="M17 12h5" />
      <path d="m4.9 19.1 3.5-3.5" />
      <path d="m15.6 8.4 3.5-3.5" />
    </IconBase>
  );
}

export function CloudIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M7 18a4 4 0 1 1 .7-7.9A5 5 0 0 1 17.5 11 3.5 3.5 0 1 1 18 18H7Z" />
    </IconBase>
  );
}

export function MoonIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M21 12.8A8.8 8.8 0 1 1 11.2 3 7 7 0 1 0 21 12.8Z" />
    </IconBase>
  );
}

export function CompassIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2.7 7-4.3 1.5 2.7-7z" />
    </IconBase>
  );
}

export function RefreshIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M20 11a8 8 0 0 0-14-5" />
      <path d="M4 4v4h4" />
      <path d="M4 13a8 8 0 0 0 14 5" />
      <path d="M20 20v-4h-4" />
    </IconBase>
  );
}

export function DownloadIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 21h16" />
    </IconBase>
  );
}

export function CalendarIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <path d="M3 10h18" />
    </IconBase>
  );
}

export function MapIcon(props) {
  return (
    <IconBase {...props}>
      <path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2z" />
      <path d="M9 4v14" />
      <path d="M15 6v14" />
    </IconBase>
  );
}

export function LocationIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </IconBase>
  );
}

export function EyeIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </IconBase>
  );
}
