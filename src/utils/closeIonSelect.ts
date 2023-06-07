export const closeIonSelect = () => {
    const ionSelectContainer = document.querySelector(".action-sheet-cancel");
    if (!ionSelectContainer) return;
    const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
    });
    ionSelectContainer.dispatchEvent(clickEvent);
};
