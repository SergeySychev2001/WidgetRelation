import "./assets/index.css";
import { initWidgetsFunc } from "./utils";

const renderWidgets = () => {
  const body = document.querySelector("body");

  const rootWidget = initWidgetsFunc.classic();
  rootWidget.updateLayout();
  console.log(rootWidget.getLayoutManager().getWidgetRelations());
  body?.appendChild(rootWidget.createDOM());
};

export { renderWidgets };
