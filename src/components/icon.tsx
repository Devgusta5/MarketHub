/**
 * Ícones do markethub — portados do protótipo v2.
 *
 * Traço 1.8, viewBox 24, linecap e linejoin redondos: um só desenho
 * para toda a interface (§5.2). Nunca usar emoji no lugar de ícone.
 */
const PATHS: Record<string, string> = {
  sparkles: `<path d="m12 3 1.9 6.1L20 11l-6.1 1.9L12 19l-1.9-6.1L4 11l6.1-1.9z"/><path d="m19 18 .6 1.7L21.3 20l-1.7.5-.6 1.7-.5-1.7-1.7-.5 1.7-.3z"/>`,
  home: `<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>`,
  building: `<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h2m4 0h2M8 11h2m4 0h2M8 15h2m4 0h2M10 21v-3h4v3"/>`,
  plus: `<path d="M12 5v14M5 12h14"/>`,
  apps: `<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>`,
  settings: `<circle cx="12" cy="12" r="3"/><path d="M19 13.5l1.1.7-2 3.4-1.3-.4a8 8 0 0 1-1.3.8l-.2 1.5H9.5L9.3 18a8 8 0 0 1-1.3-.8l-1.4.4-1.9-3.4 1.1-.7a8 8 0 0 1 0-1.5l-1.1-.8 1.9-3.3 1.4.4a8 8 0 0 1 1.3-.8l.2-1.5h4.9l.2 1.5a8 8 0 0 1 1.3.8l1.3-.4 2 3.3-1.1.8a8 8 0 0 1 0 1.5z" transform="translate(.8 -.6)"/>`,
  search: `<circle cx="10.6" cy="10.6" r="6.6"/><path d="m16 16 5 5"/>`,
  filter: `<path d="M4 7h16M7 12h10M10 17h4"/>`,
  sun: `<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/>`,
  moon: `<path d="M20.5 14A8.5 8.5 0 0 1 10 3.5a8.5 8.5 0 1 0 10.5 10.5z"/>`,
  user: `<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>`,
  image: `<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.6" cy="8.5" r="1.6"/><path d="m3 17 5-5 4.1 4 3.1-3 5.8 6"/>`,
  video: `<rect x="3" y="5" width="14" height="14" rx="3"/><path d="m17 10 4-3v10l-4-3"/>`,
  document: `<path d="M7 3h8l5 5v12a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M15 3v6h5M9 14h7m-7 4h7"/>`,
  receipt: `<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>`,
  folder: `<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>`,
  chart: `<path d="M3 20V4M3 20h18M7 16l4-5 4 2 5-7"/>`,
  clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/>`,
  activity: `<path d="M3 12h4l3-7 4 14 3-7h4"/>`,
  arrow: `<path d="m5 12 14 0m-6-6 6 6-6 6"/>`,
  back: `<path d="M19 12H5m6-6-6 6 6 6"/>`,
  close: `<path d="M5 5 19 19M19 5 5 19"/>`,
  check: `<path d="m5 12 4 4 10-10"/>`,
  download: `<path d="M12 3v13m-5-5 5 5 5-5M4 19v2h16v-2"/>`,
  zoom: `<circle cx="11" cy="11" r="8"/><path d="m17 17 4 4M8 11h6M11 8v6"/>`,
  minus: `<path d="M5 12h14"/>`,
  target: `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4"/>`,
  minimize: `<path d="M7 3v4H3M17 21v-4h4M3 7l6 6M21 17l-6-6"/>`,
  maximize: `<path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5"/>`,
  upload: `<path d="M12 16V3m-5 5 5-5 5 5M4 15v5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-5"/>`,
  link: `<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1.5 1.5M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7L13.5 18.5"/>`,
  shield: `<path d="M12 2 21 6v6c0 5.4-3.6 8.5-9 10-5.4-1.5-9-4.6-9-10V6z"/><path d="m8.5 12 2.5 2.5 5-5"/>`,
  lock: `<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>`,
  info: `<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>`,
  warning: `<path d="M11 3a2 2 0 0 1 2 0l9 15a2 2 0 0 1-2 3H4a2 2 0 0 1-2-3z"/><path d="M12 9v4m0 4h.01"/>`,
  copy: `<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>`,
  refresh: `<path d="M20 7V3l-3 3a8 8 0 1 0 3 7M20 3v6h-6"/>`,
  more: `<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>`,
  grid: `<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>`,
  list: `<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>`,
  edit: `<path d="M14 4 20 10M4 20l5-.8L20 8a2 2 0 0 0-4-4L4.8 15z"/>`,
  menu: `<path d="M4 7h16M4 12h16M4 17h16"/>`,
}

export type IconName = keyof typeof PATHS

export function Icon({
  name,
  size = 18,
  className = '',
}: {
  name: IconName | string
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden
      focusable="false"
      className={`shrink-0 ${className}`}
      style={{
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      }}
      dangerouslySetInnerHTML={{ __html: PATHS[name] ?? PATHS.info }}
    />
  )
}
