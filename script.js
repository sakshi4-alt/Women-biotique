
const books = [
    {
        id: 1,
        name: "The Alchemist",
        author: "Paulo Coelho",
        price: 299,
        category: "Fiction",
        image: "https://covers.openlibrary.org/b/title/The%20Alchemist-L.jpg"
    },
    {
        id: 2,
        name: "Atomic Habits",
        author: "James Clear",
        price: 399,
        category: "Self-help",
        image: "https://covers.openlibrary.org/b/title/Atomic%20Habits-L.jpg"
    },
    {
        id: 3,
        name: "The Power of Your Subconscious Mind",
        author: "Joseph Murphy",
        price: 249,
        category: "Self-help",
        image: "https://covers.openlibrary.org/b/title/The%20Power%20of%20Your%20Subconscious%20Mind-L.jpg"
    },
    {
        id: 4,
        name: "Wings of Fire",
        author: "A. P. J. Abdul Kalam",
        price: 250,
        category: "Education",
        image: "https://covers.openlibrary.org/b/title/Wings%20of%20Fire-L.jpg"
    },
    {
        id: 5,
        name: "Pride and Prejudice",
        author: "Jane Austen",
        price: 199,
        category: "Fiction",
        image: "https://covers.openlibrary.org/b/title/Pride%20and%20Prejudice-L.jpg"
    },
    {
        id: 6,
        name: "Think and Grow Rich",
        author: "Napoleon Hill",
        price: 279,
        category: "Self-help",
        image: "https://covers.openlibrary.org/b/title/Think%20and%20Grow%20Rich-L.jpg"
    }
];

let selectedCategory = "All";

function getCart() {
    return JSON.parse(localStorage.getItem("bookNestCart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("bookNestCart", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = document.getElementById("cart-count");

    if (count) {
        count.textContent = getCart().reduce(
            (total, item) => total + item.quantity, 0
        );
    }
}

function displayBooks() {
    const list = document.getElementById("book-list");

    if (!list) return;

    const search = document.getElementById("search").value.toLowerCase();

    const filteredBooks = books.filter(function(book) {
        const matchesSearch =
            book.name.toLowerCase().includes(search) ||
            book.author.toLowerCase().includes(search);

        const matchesCategory =
            selectedCategory === "All" ||
            book.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    list.innerHTML = "";

    filteredBooks.forEach(function(book) {
        list.innerHTML += `
            <div class="col-md-4 col-sm-6">
                <div class="book-card">
                    <img src="${book.image}" alt="${book.name}"
                         onerror="this.style.display='none'">
                    <h5>${book.name}</h5>
                    <p>${book.author}</p>
                    <p>${book.category}</p>
                    <h6>₹${book.price}</h6>
                    <button class="btn main-btn"
                        onclick="addToCart(${book.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    });

    document.getElementById("no-results").style.display =
        filteredBooks.length === 0 ? "block" : "none";
}

function filterBooks(category) {
    selectedCategory = category;
    displayBooks();
}

function addToCart(bookId) {
    const book = books.find(function(item) {
        return item.id === bookId;
    });

    const cart = getCart();
    const existingBook = cart.find(function(item) {
        return item.id === bookId;
    });

    if (existingBook) {
        existingBook.quantity++;
    } else {
        cart.push({
            id: book.id,
            name: book.name,
            price: book.price,
            quantity: 1
        });
    }

    saveCart(cart);
    alert(book.name + " added to your cart!");
}

function displayCart() {
    const container = document.getElementById("cart-items");

    if (!container) return;

    const cart = getCart();
    container.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = "<p>Your cart is empty. Visit the Books page to add books.</p>";
    }

    cart.forEach(function(item) {
        total += item.price * item.quantity;

        container.innerHTML += `
            <div class="cart-item d-flex justify-content-between align-items-center gap-3">
                <div>
                    <h5>${item.name}</h5>
                    <p class="mb-0">₹${item.price} × ${item.quantity}</p>
                </div>
                <button class="btn btn-outline-danger"
                    onclick="removeFromCart(${item.id})">
                    Remove
                </button>
            </div>
        `;
    });

    document.getElementById("cart-total").textContent = total;
}

function removeFromCart(bookId) {
    const cart = getCart().filter(function(item) {
        return item.id !== bookId;
    });

    saveCart(cart);
    displayCart();
}

function clearCart() {
    localStorage.removeItem("bookNestCart");
    updateCartCount();
    displayCart();
}

function displayCheckoutTotal() {
    const totalElement = document.getElementById("checkout-total");

    if (!totalElement) return;

    const total = getCart().reduce(function(sum, item) {
        return sum + item.price * item.quantity;
    }, 0);

    totalElement.textContent = total;
}

document.addEventListener("DOMContentLoaded", function() {
    updateCartCount();
    displayBooks();
    displayCart();
    displayCheckoutTotal();

    const search = document.getElementById("search");

    if (search) {
        search.addEventListener("input", displayBooks);
    }

    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault();
            document.getElementById("contact-message").textContent =
                "Thank you! This is a demo form; your message was not sent.";
            contactForm.reset();
        });
    }

    const checkoutForm = document.getElementById("checkout-form");

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function(event) {
            event.preventDefault();

            if (getCart().length === 0) {
                document.getElementById("checkout-message").textContent =
                    "Your cart is empty. Please add a book first.";
                return;
            }

            document.getElementById("checkout-message").textContent =
                "Demo order placed successfully! No real order or payment was made.";

            clearCart();
            displayCheckoutTotal();
            checkoutForm.reset();
        });
    }
});
