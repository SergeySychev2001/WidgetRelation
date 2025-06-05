// --- Константы для классов ---
const CLASSES = {
    WIDGET: 'widget',
    CONTAINER: 'container',
    V_CONTAINER: 'v-container',
    H_CONTAINER: 'h-container',
    DISABLED: 'disabled',
    ALIGN_CENTER: 'align-center',
    ALIGN_TOP: 'align-top',
    ALIGN_RIGHT: 'align-right',
    ALIGN_BOTTOM: 'align-bottom',
    ALIGN_LEFT: 'align-left',
    CONTAINER_BORDER: 'container-border',
    CONTAINER_BORDER_TOP: 'container-border-top',
    CONTAINER_BORDER_RIGHT: 'container-border-right',
    CONTAINER_BORDER_BOTTOM: 'container-border-bottom',
    CONTAINER_BORDER_LEFT: 'container-border-left'
};
const {
    WIDGET, CONTAINER, V_CONTAINER, H_CONTAINER,
    ALIGN_CENTER, ALIGN_TOP, ALIGN_RIGHT, ALIGN_BOTTOM, ALIGN_LEFT
} = CLASSES;

let widgetIdx = 0;

const JSONParse = (string) => JSON.parse(string);
const JSONStringify = (object) => JSON.stringify(object);

// --- Вспомогательные функции ---
const getWidgetsByAlign = (container, align) =>
    Array.from(container.querySelectorAll(`:scope > .${align}`));

const createRelation = (widget, align) => ({ widget, align });

// Фабрика для контейнеров
const createContainer = (type, align, children = []) => {
    const container = document.createElement('div');
    container.classList.add(CONTAINER, type, align);
    children.forEach(child => container.appendChild(child));
    return container;
};

// Инициализация виджета
const initWidget = (align = ALIGN_CENTER, classNames = []) => {
    const widget = document.createElement('div');
    widget.classList.add(WIDGET, align);
    if (classNames && classNames.length > 0) {
        classNames.forEach(cls => widget.classList.add(cls));
    }
    widget.setAttribute('parent', '');
    widget.setAttribute('child', '');
    widget.setAttribute('relations', '');
    widget.innerText = `${++widgetIdx} ${align}`;
    widget.addEventListener('click', (e) => {
        e.preventDefault();
        console.log(JSONStringify({
            text: widget.innerText,
            parent: widget.getAttribute('parent'),
            child: widget.getAttribute('child'),
            relations: widget.getAttribute('relations')
        }));
    });
    return widget;
};

// Инициализация вертикального контейнера
const initVContainer = (align = ALIGN_CENTER, children = []) => {
    const sections = [
        ALIGN_TOP,
        ALIGN_CENTER,
        ALIGN_BOTTOM
    ];
    const ordered = sections.flatMap(section =>
        children.filter(child => child.classList.contains(section))
    );
    return createContainer(V_CONTAINER, align, ordered);
};

// Инициализация горизонтального контейнера
const initHContainer = (align = ALIGN_CENTER, children = []) => {
    const sections = [
        ALIGN_LEFT,
        ALIGN_CENTER,
        ALIGN_RIGHT
    ];
    const ordered = sections.flatMap(section =>
        children.filter(child => child.classList.contains(section))
    );
    return createContainer(H_CONTAINER, align, ordered);
};

// --- Сборщики шаблонов ---
const initWidgetsFunc = {
    classic: () => initVContainer(ALIGN_CENTER, [
        initHContainer(ALIGN_TOP, [
            initWidget(ALIGN_CENTER),
            initWidget(ALIGN_RIGHT)
        ]),
        initVContainer(ALIGN_CENTER, [
            initWidget(ALIGN_TOP),
            initHContainer(ALIGN_BOTTOM, [
                initVContainer(ALIGN_LEFT, [
                    initHContainer(ALIGN_TOP, [
                        initWidget(ALIGN_CENTER),
                        initVContainer(ALIGN_RIGHT, [
                            initWidget(ALIGN_TOP),
                            initWidget(ALIGN_CENTER),
                        ])
                    ]),
                    initWidget(ALIGN_CENTER),
                    initWidget(ALIGN_BOTTOM),
                ]),
                initVContainer(ALIGN_LEFT, [
                    initHContainer(ALIGN_CENTER, [
                        initWidget(ALIGN_CENTER),
                        initVContainer(ALIGN_RIGHT, [
                            initWidget(ALIGN_TOP),
                            initWidget(ALIGN_CENTER),
                        ])
                    ]),
                    initWidget(ALIGN_BOTTOM),
                    initWidget(ALIGN_BOTTOM),
                ]),
            ]),
        ]),
        initWidget(ALIGN_BOTTOM),
        initVContainer(ALIGN_BOTTOM, [
            initWidget(ALIGN_TOP),
            initHContainer(ALIGN_BOTTOM, [
                initVContainer(ALIGN_LEFT, [
                    initHContainer(ALIGN_TOP, [
                        initWidget(ALIGN_CENTER),
                        initVContainer(ALIGN_RIGHT, [
                            initWidget(ALIGN_TOP),
                            initWidget(ALIGN_CENTER),
                        ])
                    ]),
                    initWidget(ALIGN_CENTER),
                    initWidget(ALIGN_BOTTOM),
                ]),
                initVContainer(ALIGN_LEFT, [
                    initHContainer(ALIGN_CENTER, [
                        initWidget(ALIGN_CENTER),
                        initVContainer(ALIGN_RIGHT, [
                            initWidget(ALIGN_TOP),
                            initWidget(ALIGN_CENTER),
                        ])
                    ]),
                    initWidget(ALIGN_BOTTOM),
                    initWidget(ALIGN_BOTTOM),
                ]),
            ]),
        ]),
    ]),
    binary: (depth) => {
        if (depth === 0) return initWidget(ALIGN_CENTER);
        return initVContainer(ALIGN_CENTER, [
            initHContainer(ALIGN_CENTER, [
                initWidgetsFunc.binary(depth - 1),
                initWidgetsFunc.binary(depth - 1),
            ])
        ]);
    },
    ring: (level) => {
        if (level === 0) return initWidget(ALIGN_CENTER);
        return initHContainer(ALIGN_CENTER, [
            initWidget(ALIGN_LEFT),
            initVContainer(ALIGN_CENTER, [
                initWidget(ALIGN_TOP),
                initWidgetsFunc.ring(level - 1),
                initWidget(ALIGN_BOTTOM),
            ]),
            initWidget(ALIGN_RIGHT),
        ]);
    },
    mirrorGroup: () => {
        const createGroup = () =>
            initHContainer(ALIGN_CENTER, [
                initVContainer(ALIGN_LEFT, [
                    initWidget(ALIGN_TOP),
                    initWidget(ALIGN_CENTER),
                    initWidget(ALIGN_BOTTOM),
                ]),
                initVContainer(ALIGN_RIGHT, [
                    initWidget(ALIGN_TOP),
                    initWidget(ALIGN_CENTER),
                    initWidget(ALIGN_BOTTOM),
                ])
            ]);
        return initVContainer(ALIGN_CENTER, Array.from({ length: 8 }, createGroup));
    },
    vOrH: () => {
        let widgets = Array.from({ length: 50 }, () => initWidget(ALIGN_CENTER));
        return widgets.reduce((acc, widget, idx) =>
            idx % 2 === 0
                ? initVContainer(ALIGN_CENTER, [acc, widget])
                : initHContainer(ALIGN_CENTER, [acc, widget])
        );
    },
    "5x10": () =>
        initVContainer(ALIGN_CENTER,
            Array.from({ length: 5 }, () =>
                initHContainer(ALIGN_CENTER,
                    Array.from({ length: 10 }, () => initWidget(ALIGN_CENTER))
                )
            )
        ),
    random: (maxDepth = 2) => {
        function getRandomAlign(parentContainerType) {
            if (parentContainerType === V_CONTAINER)
                return [ALIGN_TOP, ALIGN_CENTER, ALIGN_BOTTOM][Math.floor(Math.random() * 3)];
            if (parentContainerType === H_CONTAINER)
                return [ALIGN_LEFT, ALIGN_CENTER, ALIGN_RIGHT][Math.floor(Math.random() * 3)];
            return [ALIGN_CENTER, ALIGN_TOP, ALIGN_BOTTOM, ALIGN_LEFT, ALIGN_RIGHT][Math.floor(Math.random() * 5)];
        }

        const getRandomContainerType = () =>
            Math.random() > 0.5 ? V_CONTAINER : H_CONTAINER;

        function generateRandomStructure(currentDepth = 0, parentContainerType = null) {
            const children = [];
            const numChildren = Math.floor(Math.random() * 5) + 1;
            const rootContainerAlign = getRandomAlign(parentContainerType);
            const rootContainerType = getRandomContainerType();

            for (let i = 0; i < numChildren; i++) {
                if (currentDepth < maxDepth && Math.random() > 0.3) {
                    children.push(generateRandomStructure(currentDepth + 1, rootContainerType));
                } else {
                    children.push(initWidget(getRandomAlign(rootContainerType)));
                }
            }

            if (rootContainerType === V_CONTAINER)
                return initVContainer(rootContainerAlign, children);
            if (rootContainerType === H_CONTAINER)
                return initHContainer(rootContainerAlign, children);
            throw new Error("Unexpected switch-case");
        }

        return generateRandomStructure();
    }
};

function extractId(widget) {
    const text = widget.textContent.trim();
    const match = text.match(/^\d+/);
    return match ? match[0] : '';
}

function findParentWidget(node) {
    let parent = node.parentNode;
    while (parent && parent !== document) {
        if (parent.nodeType === Node.ELEMENT_NODE) {
            if (parent.classList.contains('widget')) {
                return parent;
            }
            if (parent.classList.contains('container')) {
                parent = parent.parentNode;
                continue;
            }
        }
        parent = parent.parentNode;
    }
    return null;
}

function findChildWidgets(node) {
    const children = [];
    function traverse(current) {
        for (const child of current.childNodes) {
            if (child.nodeType === Node.ELEMENT_NODE) {
                if (child.classList.contains('widget')) {
                    children.push(child);
                } else {
                    traverse(child);
                }
            }
        }
    }
    traverse(node);
    return children;
}

// document.addEventListener('DOMContentLoaded', () => {
//     const widgets = document.querySelectorAll('.widget');
//     widgets.forEach(widget => {
//         const parentWidget = findParentWidget(widget);
//         const childWidgets = findChildWidgets(widget);

//         const parentId = parentWidget ? extractId(parentWidget) : '';
//         const childIds = childWidgets.map(extractId).filter(id => id).join(',');

//         widget.setAttribute('parent', parentId);
//         widget.setAttribute('child', childIds);

//         const relations = [];
//         if (parentId) relations.push(parentId);
//         if (childIds) relations.push(...childIds.split(','));
//         widget.setAttribute('relations', [...new Set(relations.filter(id => id))].join(','));
//     });
// });

// --- Запуск ---
let rootWidget = initWidgetsFunc.random();