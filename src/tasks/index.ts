import "./assets/index.css";
import { initWidgetsFunc } from './utils';

const renderWidgets = () => {
    const body = document.querySelector('body');
    body?.appendChild(initWidgetsFunc.classic().createDOM());
}

export { renderWidgets }