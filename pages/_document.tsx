import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Honest answers for white parents raising Black children — from a Black adoptee who lived the experience." />
        <meta property="og:title" content="Ask the Adoptee" />
        <meta property="og:description" content="Honest answers for white parents raising Black children — from a Black adoptee who lived the experience." />
        <meta property="og:image" content="https://ask-the-adoptee-app.vercel.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://ask-the-adoptee-app.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Ask the Adoptee" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ask the Adoptee" />
        <meta name="twitter:description" content="Honest answers for white parents raising Black children — from a Black adoptee who lived the experience." />
        <meta name="twitter:image" content="https://ask-the-adoptee-app.vercel.app/og-image.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
