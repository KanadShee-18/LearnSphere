const BASE_URL = import.meta.env.VITE_BASE_URL;
// const BASE_URL = "http://localhost:4000/api/v1";

export const categories = {
    // CATEGORIES_API: BASE_URL + "course/showallcategories",
    CATEGORIES_API: `${BASE_URL}/course/showallcategories`,
};
