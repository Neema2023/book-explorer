// Import functions from favorites.js
import {
    addFavorite,
    removeFavorite,
    getFavorites
} from "./favorites.js";



// Import the API function from fetchBooks.js
import { fetchBooks } from "./fetchBooks.js";



// Select the homepage book grid and messages
const booksGrid = document.querySelector("#books-grid");
const booksMessage = document.querySelector("#books-message");



// Select the Favorites page list
const favoritesList = document.querySelector("#favorites-list");



// Store the current success message
let successMessage = null;
let successTimer = null;


// Show a green success confirmation message
function showDialog(message) {
    // Remove the previous message if it exists
    if (successMessage) {
        successMessage.remove();
        clearTimeout(successTimer);
    }


    // Create the message element
    successMessage = document.createElement("div");

    // Add Tailwind CSS styling
    successMessage.className =
        "fixed right-5 top-5 z-[9999] rounded-xl bg-green-600 px-6 py-4 font-semibold text-white shadow-lg";

    // Add the message text
    successMessage.textContent = "✓ " + message;

    // Display the message
    document.body.appendChild(successMessage);

    // Remove it after three seconds
    successTimer = setTimeout(function() {
        if (successMessage) {
            successMessage.remove();
            successMessage = null;
        }
    }, 3000);
}

/*
==================================================
Exercise 3.2: Create a book card from API data
==================================================
*/

function createBookCard(book) {
    // Create the main card element
    const card = document.createElement("article");

    // Use the Open Library work key as the book ID
    // Fall back to the book title if no key exists
    const bookId = book.key || book.title;


    card.dataset.bookId = bookId;
    card.dataset.title = book.title || "Untitled Book";

    card.dataset.author =
        (book.author_name && book.author_name[0]) || "Unknown Author";

    card.dataset.category =
        (book.subject && book.subject[0]) || "Book";



    // Apply the existing Tailwind card design
    card.className =
        "flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-[#DCE7DF] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg";

    // Create the book cover
    const image = document.createElement("img");

    // Open Library provides cover IDs for many books
    if (book.cover_i) {
        image.src =
            `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    } else {
        // Use a placeholder if the API has no cover
        image.src =
            "https://placehold.co/600x400?text=No+Book+Cover";
    }

    image.alt = `Cover of ${book.title || "book"}`;
    image.className = "h-56 w-full object-cover";
    image.loading = "lazy";

    // Replace the image if the cover cannot load
    image.onerror = function() {
        image.onerror = null;
        image.src =
            "https://placehold.co/600x400?text=No+Book+Cover";
    };

    // Create the card content container
    const content = document.createElement("div");
    content.className = "flex flex-1 flex-col p-5";

    // Display the book title
    const title = document.createElement("h3");
    title.className =
        "line-clamp-2 min-h-[3.5rem] text-lg font-bold text-[#263536]";

    title.textContent = book.title || "Untitled Book";

    // Display the author's name
    const author = document.createElement("p");
    author.className =
        "mt-1 text-sm text-[#68756D]";
    author.textContent =
        `By ${book.author_name?.[0] || "Unknown Author"}`;

    // Display the publication year when available
    const description = document.createElement("p");
    description.className =
        "mt-3 text-sm leading-6 text-[#52666B]";

    description.textContent = book.first_publish_year ?
        `First published in ${book.first_publish_year}.` :
        "Discover this book on Open Library.";

    // Create buttons container
    // Create buttons container
    const buttonsContainer = document.createElement("div");

    buttonsContainer.className =
        "mt-auto grid grid-cols-[1.15fr_1fr] gap-2 pt-5";

    // Create the Add to Favorites button
    const favoriteButton = document.createElement("button");

    favoriteButton.type = "button";
    favoriteButton.dataset.action = "add-favorite";

    favoriteButton.className =
        "favorite-btn flex min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg bg-[#20834A] px-2 py-2.5 text-xs font-semibold text-white transition hover:bg-[#176638]";

    favoriteButton.innerHTML =
        '<span aria-hidden="true">♥</span><span>Add to Favorites</span>';

    // Create the View Details button
    const detailsButton = document.createElement("button");

    detailsButton.type = "button";
    detailsButton.dataset.action = "view-details";

    detailsButton.className =
        "flex min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-lg border border-[#20834A] px-2 py-2.5 text-xs font-semibold text-[#20834A] transition hover:bg-green-50";

    detailsButton.innerHTML =
        '<span aria-hidden="true">ⓘ</span><span>View Details</span>';

    // Add both buttons to the same row
    buttonsContainer.appendChild(favoriteButton);
    buttonsContainer.appendChild(detailsButton);

    // Assemble the card
    content.appendChild(title);
    content.appendChild(author);
    content.appendChild(description);
    content.appendChild(buttonsContainer);

    card.appendChild(image);
    card.appendChild(content);

    return card;
}

/*
==================================================
Load books from the API and display them
==================================================
*/

async function loadBooks(title = "javascript") {
    // Stop if this page has no homepage book grid
    if (!booksGrid) return;

    // Show a loading message
    booksMessage.textContent = "Loading books...";

    // Clear previously displayed cards
    booksGrid.innerHTML = "";

    try {
        // Fetch books from Open Library
        const books = await fetchBooks(title);

        // Show a message if no books were returned
        if (!books || books.length === 0) {
            booksMessage.textContent =
                "No books found. Try another search.";

            return;
        }

        // Create and display each book card
        const fragment = document.createDocumentFragment();

        books.forEach(function(book) {
            fragment.appendChild(createBookCard(book));
        });

        booksGrid.appendChild(fragment);

        // Clear the loading message
        booksMessage.textContent = "";

    } catch (error) {
        // Show the actual error in the browser Console
        console.error("Could not load books:", error);
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);

        // Display a message on the page
        booksMessage.textContent =
            "Sorry, books could not be loaded. Please try again.";
    }

}

/*
==================================================
Display favorite books on the Favorites page
==================================================
*/



function displayFavorites() {
    // Stop if this page has no favorites list
    if (!favoritesList) return;

    // Clear the existing favorite cards
    favoritesList.innerHTML = "";

    // Get saved favorite books
    const favorites = getFavorites();

    // Display a message if there are no favorites
    if (favorites.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.className =
            "col-span-full rounded-2xl border border-dashed border-[#D5E0D9] bg-white p-8 text-center text-[#52666B]";

        emptyMessage.textContent =
            "No favorite books yet. Explore books and add your favorites!";

        favoritesList.appendChild(emptyMessage);
        return;
    }

    // Create a card for each saved favorite
    favorites.forEach(function(book) {
        const bookElement = document.createElement("article");

        bookElement.className =
            "overflow-hidden rounded-2xl border border-[#D5E0D9] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg";

        // Display the book cover if available
        if (book.image) {
            const image = document.createElement("img");

            image.src = book.image;
            image.alt = book.title || "Book cover";
            image.className = "h-56 w-full object-cover";
            image.loading = "lazy";

            image.onerror = function() {
                image.remove();
            };

            bookElement.appendChild(image);
        }

        // Create the card content
        const content = document.createElement("div");
        content.className = "p-5";

        // Display the category
        const category = document.createElement("p");
        category.className =
            "text-xs font-semibold uppercase tracking-wider text-[#20834A]";
        category.textContent = book.category || "Book";

        // Display the title
        const title = document.createElement("h3");
        title.className =
            "mt-2 text-lg font-bold text-[#263536]";
        title.textContent = book.title || "Untitled Book";

        // Display the author
        const author = document.createElement("p");
        author.className = "mt-2 text-sm text-[#52666B]";
        author.textContent =
            "By " + (book.author || "Unknown Author");

        // Create the Remove Favorite button
        const removeButton = document.createElement("button");

        removeButton.type = "button";
        removeButton.dataset.removeId = book.id;
        removeButton.className =
            "mt-5 w-full rounded-xl bg-[#FCE8E6] px-4 py-3 font-semibold text-[#B42318] transition hover:bg-[#F8D7D4]";
        removeButton.textContent = "Remove Favorite";

        // Add all elements to the card
        content.appendChild(category);
        content.appendChild(title);
        content.appendChild(author);
        content.appendChild(removeButton);

        bookElement.appendChild(content);
        favoritesList.appendChild(bookElement);
    });
}

/*
==================================================
Handle View Details clicks
==================================================
*/
/*
==================================================
Handle View Details clicks
==================================================
*/

if (booksGrid) {
    booksGrid.addEventListener("click", function(event) {
        const detailsButton = event.target.closest(
            '[data-action="view-details"]'
        );

        if (!detailsButton) return;

        const card = detailsButton.closest("[data-book-id]");

        if (!card) return;

        const bookId = card.dataset.bookId;

        window.location.href =
            `https://openlibrary.org${bookId}`;
    });
}

/*
==================================================
Handle Add to Favorites clicks
==================================================
*/

// Use event delegation because API cards are created dynamically
if (booksGrid) {
    booksGrid.addEventListener("click", function(event) {
        const addButton = event.target.closest(
            '[data-action="add-favorite"]'
        );

        // Ignore clicks outside the favorite button
        if (!addButton) return;

        // Find the book card containing the button
        const card = addButton.closest("[data-book-id]");

        if (!card) return;

        // Get the book cover
        const imageElement = card.querySelector("img");

        // Create the book information object
        const book = {
            id: card.dataset.bookId,
            title: card.dataset.title,
            author: card.dataset.author,
            category: card.dataset.category,
            image: imageElement ? imageElement.src : ""
        };

        // Check the saved favorites
        const favorites = getFavorites();

        const alreadyExists = favorites.some(function(favorite) {
            return String(favorite.id) === String(book.id);
        });

        // Avoid saving the same book twice
        if (alreadyExists) {
            showDialog(
                "This book is already in your favorites."
            );

            return;
        }

        // Save the selected book
        addFavorite(book);

        // Show confirmation
        showDialog(
            "Book added to favorites successfully!"
        );

        // Refresh the favorites list if it exists
        displayFavorites();
    });
}

/*
==================================================
Handle Remove Favorite clicks
==================================================
*/

if (favoritesList) {
    favoritesList.addEventListener("click", function(event) {
        const removeButton = event.target.closest(
            "[data-remove-id]"
        );

        // Ignore clicks outside the remove button
        if (!removeButton) return;

        // Get the selected book ID
        const bookId = removeButton.dataset.removeId;

        // Remove the selected favorite
        removeFavorite(bookId);

        // Refresh the favorites page
        displayFavorites();

        // Show confirmation
        showDialog(
            "Book removed from favorites successfully!"
        );
    });

    // Load saved favorites when this page opens
    displayFavorites();
}




/*

Exercise 3.3: Search books by title
==================================================
*/

const searchForm = document.querySelector("#hero-search-form");
const searchInput = document.querySelector("#hero-search");

if (searchForm && searchInput) {
    searchForm.addEventListener("submit", function(event) {
        // Prevent the page from refreshing
        event.preventDefault();

        // Get the search term and remove extra spaces
        const searchTerm = searchInput.value.trim();

        // Check whether the user entered a search term
        if (!searchTerm) {
            if (booksMessage) {
                booksMessage.textContent =
                    "Please enter a book title to search.";
            }

            // Return the cursor to the search input
            searchInput.focus();

            // Stop searching because the input is empty
            return;
        }

        // Search for books using the API
        loadBooks(searchTerm);
    });
}

/*
==================================================
Start the homepage
==================================================
*/

if (booksGrid) {
    loadBooks("javascript");
}