export const navigateToSpecificItem = (
    type: "immobili" | "persone",
    id: string,
    navigate: (url: string) => void
) => navigate(`/${type}/${id}`);
