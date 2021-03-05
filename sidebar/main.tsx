import { render } from "preact";

import App from "./App";

import "./index.css";

browser.windows.getCurrent().then((window) => {
  render(<App windowId={window.id} />, document.getElementById("app")!);
});
