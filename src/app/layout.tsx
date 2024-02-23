import { Providers } from "./providers";
import { cookies } from 'next/headers'
import { ToastContainer } from 'react-toastify';

import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const theme = cookies().get("theme");

  return (
    <html className={`${theme?.value} max-w-[100vw] bg-[#F5F3E7] dark:bg-[#181818] overflow-x-hidden`} lang="en">
      <body className="overflow-hidden min-h-[100vh] dark:bg-[#181818] text-[#004C46] dark:text-[#F5F3E7]">
        <Providers>
          <ToastContainer />
          {children}
        </Providers>
      </body>
    </html>
  )
}
