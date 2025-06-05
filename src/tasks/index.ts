import "./assets/index.css";
import { initWidgetsFunc, updateLayoutByWidget } from './utils';

const renderWidgets = () => {
    const body = document.querySelector('body');

    const rootWidget = initWidgetsFunc.classic();
    updateLayoutByWidget(rootWidget);
    body?.appendChild(rootWidget.createDOM());

    // const rootWidget = initWidgetsFunc.classic();
    // updateLayoutByWidgets(rootWidget.getChildren(), ContainerOrientation.vertical);
    // rootWidget.getChildren().forEach(i => body?.appendChild(i.createDOM()));
}

export { renderWidgets }