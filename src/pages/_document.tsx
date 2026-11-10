import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" suppressHydrationWarning>
      <Head />
      <body className="antialiased bg-black">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
