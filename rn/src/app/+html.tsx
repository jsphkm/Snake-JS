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
                <ScrollViewStyleReset />
                <style dangerouslySetInnerHTML={{ __html: css }} />
            </head>
            <body>{children}</body>
        </html>
    );
};
