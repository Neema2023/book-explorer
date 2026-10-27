const STORAGE_KEY = "favoriteBooks";

// Load favorites from localStorage
let favorites = JSON.parse(
    localStorage.getItem(STORAGE_KEY) || "[]"
);

// Save favorites to localStorage
function saveFavorites() {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(favorites)
    );
}

// Add a book to favorites
export function addFavorite(book) {
    const alreadyExists = favorites.some(
        favorite => favorite.id === book.id
    );

    if (alreadyExists) {
        return;
    }

    favorites.push(book);
    saveFavorites();
}

// Remove a book from favorites
export function removeFavorite(bookId) {
    favorites = favorites.filter(
        book => book.id !== bookId
    );

    saveFavorites();
}

// Get all favorite books
export function getFavorites() {
    return [...favorites];
}