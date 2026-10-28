import { fetchBooks } from "./fetchBooks.js";

console.log("testAPI.js is running");

async function testBooksAPI() {
    try {
        const books = await fetchBooks("harry potter");

        console.log("Books received:", books);
        console.log("First book:", books[0]);
    } catch (error) {
        console.error("Could not load books:", error);
    }
}

testBooksAPI();