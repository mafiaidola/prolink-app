import type { SVGProps } from 'react';

export const Icons = {
  Logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10.1 2.17a2.5 2.5 0 0 0 -3.62 3.62" />
      <path d="M13.9 5.99a2.5 2.5 0 0 0 -3.62 -3.62" />
      <path d="M5.99 13.9a2.5 2.5 0 0 0 3.62 3.62" />
      <path d="M2.17 10.1a2.5 2.5 0 0 0 3.62 -3.62" />
      <path d="M18.01 10.1a2.5 2.5 0 0 0 -3.62 -3.62" />
      <path d="M21.83 13.9a2.5 2.5 0 0 0 -3.62 3.62" />
      <path d="M13.9 18.01a2.5 2.5 0 0 0 3.62 3.62" />
      <path d="M10.1 21.83a2.5 2.5 0 0 0 3.62 -3.62" />
      <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    </svg>
  ),
};
