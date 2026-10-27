// Import functions from favorites.js
import {
    addFavorite,
    removeFavorite,
    getFavorites
} from "./favorites.js";

// Select all book cards and the favorites list
const bookCards = document.querySelectorAll("[data-book-id]");
const favoritesList = document.querySelector("#favorites-list");

// Store the current success message
let successMessage = null;
let successTimer = null;

// Show green success confirmation message
function showDialog(message) {
    // Remove the previous message if it exists
    if (successMessage) {
        successMessage.remove();
        clearTimeout(successTimer);
    }

    // Create a new success message
    successMessage = document.createElement("div");

    // Add green styling to the message
    successMessage.className =
        "fixed right-5 top-5 z-[9999] rounded-xl bg-green-600 px-6 py-4 font-semibold text-white shadow-lg";

    // Add a checkmark and the message text
    successMessage.textContent = "✓ " + message;

    // Add the message to the page
    document.body.appendChild(successMessage);

    // Remove the message after 3 seconds
    successTimer = setTimeout(function() {
        if (successMessage) {
            successMessage.remove();
            successMessage = null;
        }
    }, 3000);
}

// Display favorite books on the Favorites page
function displayFavorites() {
    // Stop if this page has no favorites list
    if (!favoritesList) return;

    // Clear the existing book cards
    favoritesList.innerHTML = "";

    // Get saved favorite books
    const favorites = getFavorites();

    // Display a message when there are no favorites
    if (favorites.length === 0) {
        const emptyMessage = document.createElement("p");

        emptyMessage.className =
            "col-span-full rounded-2xl border border-dashed border-[#D5E0D9] bg-white p-8 text-center text-[#52666B]";

        emptyMessage.textContent =
            "No favorite books yet. Explore books and add your favorites!";

        favoritesList.appendChild(emptyMessage);
        return;
    }

    // Create a card for each favorite book
    favorites.forEach(function(book) {
        const bookElement = document.createElement("article");

        bookElement.className =
            "overflow-hidden rounded-2xl border border-[#D5E0D9] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg";

        // Display the book image
        if (book.image) {
            const image = document.createElement("img");

            image.src = book.image;
            image.alt = book.title || "Book cover";
            image.className = "h-56 w-full object-cover";
            image.loading = "lazy";

            // Remove the image if it fails to load
            image.onerror = function() {
                image.remove();
            };

            bookElement.appendChild(image);
        }

        // Create the card content container
        const content = document.createElement("div");
        content.className = "p-5";

        // Display the book category
        const category = document.createElement("p");

        category.className =
            "text-xs font-semibold uppercase tracking-wider text-[#20834A]";

        category.textContent = book.category || "Book";

        // Display the book title
        const title = document.createElement("h3");

        title.className = "mt-2 text-lg font-bold text-[#263536]";
        title.textContent = book.title || "Untitled Book";

        // Display the author's name
        const author = document.createElement("p");

        author.className = "mt-2 text-sm text-[#52666B]";
        author.textContent = "By " + (book.author || "Unknown Author");

        // Create the Remove Favorite button
        const removeButton = document.createElement("button");

        removeButton.type = "button";
        removeButton.dataset.removeId = book.id;

        removeButton.className =
            "mt-5 w-full rounded-xl bg-[#FCE8E6] px-4 py-3 font-semibold text-[#B42318] transition hover:bg-[#F8D7D4]";

        removeButton.textContent = "Remove Favorite";

        // Add elements to the card content
        content.appendChild(category);
        content.appendChild(title);
        content.appendChild(author);
        content.appendChild(removeButton);

        // Add the content to the book card
        bookElement.appendChild(content);

        // Add the card to the favorites list
        favoritesList.appendChild(bookElement);
    });
}

// Add a book to favorites when the button is clicked
bookCards.forEach(function(card) {
    // Find the Add to Favorites button
    const addButton = card.querySelector(
        '[data-action="add-favorite"]'
    );

    // Stop if the card has no favorite button
    if (!addButton) return;

    // Listen for a click on the button
    addButton.addEventListener("click", function() {
        // Get the image from the book card
        const imageElement = card.querySelector("img");
        let imageUrl = "";

        if (imageElement) {
            imageUrl = imageElement.src;
        } else if (card.dataset.image) {
            imageUrl = card.dataset.image;
        }

        // Create an object containing the book information
        const book = {
            id: card.dataset.bookId,
            title: card.dataset.title,
            author: card.dataset.author,
            category: card.dataset.category,
            image: imageUrl
        };

        // Get the current favorite books
        const favorites = getFavorites();

        // Check whether the book already exists
        const alreadyExists = favorites.some(function(favorite) {
            return favorite.id === book.id;
        });

        // Show a message if the book already exists
        if (alreadyExists) {
            showDialog(
                "This book is already in your favorites."
            );

            return;
        }

        // Save the book using the imported function
        addFavorite(book);

        // Show green success confirmation
        showDialog(
            "Book added to favorites successfully!"
        );

        // Update the favorites list if it exists on this page
        displayFavorites();
    });
});

// Remove a favorite book using a click event
if (favoritesList) {
    favoritesList.addEventListener("click", function(event) {
        // Find the Remove Favorite button that was clicked
        const removeButton = event.target.closest("[data-remove-id]");

        // Stop if the click was not on a Remove Favorite button
        if (!removeButton) return;

        // Get the ID of the selected book
        const bookId = removeButton.dataset.removeId;

        // Remove the book from saved favorites
        removeFavorite(bookId);

        // Refresh the displayed favorites
        displayFavorites();

        // Show green success confirmation
        showDialog(
            "Book removed from favorites successfully!"
        );
    });

    // Load saved favorites when the Favorites page opens
    displayFavorites();
}