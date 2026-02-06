import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head />
      <body className="antialiased" style={{ backgroundColor: '#353535' }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
