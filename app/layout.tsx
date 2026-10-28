import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Frames by Andrej | Photography & Film',
  description: 'Photography and film inspired by places, people, and the moments in between. Based in North Macedonia.',
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
