import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import '@ant-design/v5-patch-for-react-19';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import AuthCheck from '@/components/auth/AuthCheck';

const beVietnam = Be_Vietnam_Pro({
  subsets: ['vietnamese'], 
  weight: ['200', '300', '400', '500'], 
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${beVietnam.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <SidebarProvider>
            <AuthCheck>{children}</AuthCheck>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
