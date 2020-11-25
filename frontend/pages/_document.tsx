// adjust your pages/_document.js
import { ColorModeScript } from "@chakra-ui/react";
import NextDocument, {
  Html,
  Main,
  Head,
  NextScript,
  DocumentContext,
} from "next/document";

export default class Document extends NextDocument {
  static getInitialProps(ctx: DocumentContext) {
    return NextDocument.getInitialProps(ctx);
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <ColorModeScript initialColorMode="light" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
