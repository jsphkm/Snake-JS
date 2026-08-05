import { ScrollViewStyleReset } from "expo-router/html";
import { palette } from "../theme";

const css = `
    html, body, #root { height: 100%; }
    body { margin: 0; background: ${palette.light.page}; }
    @media (prefers-color-scheme: dark) {
        body { background: ${palette.dark.page}; }
    }
`;

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover"
        />
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
