import type { AppProps } from "next/app";

const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Georgia, serif;
    background-color: #2C1810;
    color: #F5EFE8;
    line-height: 1.8;
  }
`;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style>{globalStyles}</style>
      <Component {...pageProps} />
    </>
  );
}
