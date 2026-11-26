import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 18, ...rest }: P, children: React.ReactNode) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const IconHome = (p: P) => base(p, <><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /><path d="M10 21v-6h4v6" /></>)
export const IconExpand = (p: P) => base(p, <><path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="m21 3-7 7" /><path d="m3 21 7-7" /></>)
export const IconWalk = (p: P) => base(p, <><circle cx="13" cy="4" r="2" /><path d="m9 20 3-6 3 3v4" /><path d="m6 12 3-4 4 1 3 3h3" /><path d="m12 14-1-5" /></>)
export const IconCar = (p: P) => base(p, <><path d="M5 17h14" /><path d="M3 17v-4l2-5a2 2 0 0 1 1.9-1.4h10.2A2 2 0 0 1 19 8l2 5v4" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /><path d="M3 13h18" /></>)
export const IconLift = (p: P) => base(p, <><path d="M2 5l20-3" /><path d="M12 3.5V8" /><rect x="6" y="8" width="12" height="10" rx="2" /><path d="M6 13h12" /></>)
export const IconPin = (p: P) => base(p, <><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>)
export const IconTicket = (p: P) => base(p, <><path d="M3 8a2 2 0 0 0 0 4v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4a2 2 0 0 1 0-4V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z" transform="translate(0 1)" /><path d="M14 5v2M14 11v2M14 17v2" /></>)
export const IconPhone = (p: P) => base(p, <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.9 2z" />)
export const IconInstagram = (p: P) => base(p, <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></>)
export const IconGlobe = (p: P) => base(p, <><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" /></>)
export const IconStar = (p: P) => base(p, <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z" />)
export const IconNav = (p: P) => base(p, <path d="M3 11 21 3l-8 18-2-8z" />)
export const IconClose = (p: P) => base(p, <><path d="M18 6 6 18" /><path d="m6 6 12 12" /></>)
export const IconCheck = (p: P) => base(p, <path d="m5 12 5 5 9-10" />)
export const IconSpark = (p: P) => base(p, <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></>)
export const IconMountain = (p: P) => base(p, <><path d="m3 20 6.5-11 4 6.5L16 12l5 8z" /><path d="m8 12 1.5 1.5L11 12" /></>)
export const IconDownload = (p: P) => base(p, <><path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" /></>)
export const IconImage = (p: P) => base(p, <><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="2" /><path d="m21 17-5-5-9 8" /></>)
export const IconSnow = (p: P) => base(p, <><path d="M12 2v20M4.9 6l14.2 12M4.9 18 19.1 6" /><path d="m9 4 3 2 3-2M9 20l3-2 3 2" /></>)
