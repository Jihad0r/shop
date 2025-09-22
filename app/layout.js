import "./globals.css";

export const metadata = {
  title: "J0 Store",
  description: "your favorite store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}