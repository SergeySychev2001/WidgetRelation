import "./assets/index.css";
import { initWidgetsFunc } from "./utils";

const renderWidgets = () => {
  const body = document.querySelector("body");

  const rootWidget = initWidgetsFunc.classic();
  rootWidget.getLayoutManager().updateLayout();
  
  body?.appendChild(rootWidget.createDOM());
};

export { renderWidgets };
