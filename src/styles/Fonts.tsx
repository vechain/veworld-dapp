import { Global } from "@emotion/react"

const Fonts = () => (
  <Global
    styles={`
    @font-face {
      font-family: "Inter";
      src: url("./fonts/Inter-Light.woff2") format("woff2");
      font-weight: 300;
      font-style: normal;
    }
    
    @font-face {
      font-family: "Inter";
      src: url("./fonts/Inter-Regular.woff2") format("woff2");
      font-weight: 400;
      font-style: normal;
    }
    
    @font-face {
      font-family: "Inter";
      src: url("./fonts/Inter-Medium.woff2") format("woff2");
      font-weight: 500;
      font-style: normal;
    }
    
    @font-face {
      font-family: "Inter";
      src: url("./fonts/Inter-Bold.woff2") format("woff2");
      font-weight: 700;
      font-style: normal;
    }
    
    @font-face {
      font-family: "JetBrains Mono";
      src: url("./fonts/JetBrainsMono-Light.woff2") format("woff2");
      font-weight: 300;
      font-style: normal;
    }
    
    @font-face {
      font-family: "JetBrains Mono";
      src: url("./fonts/JetBrainsMono-Regular.woff2") format("woff2");
      font-weight: 400;
      font-style: normal;
    }
    
    @font-face {
      font-family: "JetBrains Mono";
      src: url("./fonts/JetBrainsMono-Bold.woff2") format("woff2");
      font-weight: 700;
      font-style: normal;
    }
    
    @font-face {
      font-family: "JetBrains Mono";
      src: url("./fonts/JetBrainsMono-ExtraBold.woff2") format("woff2");
      font-weight: 800;
      font-style: normal;
    }
      `}
  />
)

export default Fonts
