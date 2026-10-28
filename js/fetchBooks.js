const API_URL = "https://openlibrary.org/search.json";

export async function fetchBooks(title = "javascript") {
    try {
        const response = await fetch(
            `${API_URL}?title=${encodeURIComponent(title)}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch books");
        }

        const data = await response.json();

        return data.docs;
    } catch (error) {
        console.error("Error fetching books:", error);
        throw error;
    }
}