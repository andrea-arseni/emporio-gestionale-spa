import { useRef } from "react";

const useList = () => {
    const ionListRef = useRef<any>();

    const closeItems = () => ionListRef.current.closeSlidingItems();

    return { list: ionListRef, closeItemsList: closeItems };
};

export default useList;
