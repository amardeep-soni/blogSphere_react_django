export const formatCategoryForDB = (category) => {
    return category.trim().replace(/\s+/g, '-').toLowerCase();
};

export const formatCategoryForDisplay = (category) => {
    return category ? category.replace(/-/g, ' ') : '';
}; 