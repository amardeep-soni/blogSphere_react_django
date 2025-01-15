export const formatCategoryForDB = (category) => {
    return category.trim().replace(/\s+/g, '-').toLowerCase();
};

export const formatCategoryForDisplay = (category) => {
    if (!category) return 'Uncategorized';
    if (typeof category === 'string') return category;
    return category.name || 'Uncategorized';
}; 

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};