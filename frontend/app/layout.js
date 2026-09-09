export const metadata = { title: "Zahlenraten" };

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body style={{ fontFamily: "sans-serif", padding: "2rem" }}>{children}</body>
    </html>
  );
}
