export const freeFocus = () => {
    if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
};
