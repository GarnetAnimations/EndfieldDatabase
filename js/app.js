// =============================================
// Global Variables
// =============================================

let operatorData = [];      // Stores JSON data
let currentLetter = null;   // Currently selected letter filter


// =============================================
// Load JSON Data
// =============================================

async function loadOperators() {
    try {
        const response = await fetch('data/characterData.json');
        operatorData = await response.json();

        renderAlphabetButtons();
        renderOperators();

        setupSearchListener();

    } catch (error) {
        console.error("Error loading operator data:", error);
    }
}


// =============================================
// Render Alphabet Filter Buttons
// =============================================

function renderAlphabetButtons() {

    const alphabetContainer = document.getElementById('alphabet-filter');
    alphabetContainer.innerHTML = '';

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    letters.forEach(letter => {

        const button = document.createElement('button');
        button.textContent = letter;

        button.addEventListener('click', () => {

            const section = document.getElementById(`letter-${letter}`);

            if (section) {
                section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });

        alphabetContainer.appendChild(button);
    });
}


// =============================================
// Render Operators
// =============================================

function renderOperators() {

    const container = document.getElementById('operator-list');
    container.innerHTML = '';

    const searchValue = document
        .getElementById('search-input')
        .value
        .toLowerCase();

    operatorData.forEach(group => {

        // Skip group if letter filter is active and doesn't match
        if (currentLetter && group.letter_group !== currentLetter) {
            return;
        }

        const filteredOperators = group.operators.filter(operator =>
            operator.name.toLowerCase().includes(searchValue)
        );

        // If no operators match search in this group, skip rendering it
        if (filteredOperators.length === 0) {
            return;
        }

        const letterSection = document.createElement('div');
        letterSection.className = 'letter-section';
        letterSection.id = `letter-${group.letter_group}`;

        const letterHeading = document.createElement('h2');
        letterHeading.textContent = group.letter_group;
        letterSection.appendChild(letterHeading);

        filteredOperators.forEach(operator => {

            const operatorCard = document.createElement('div');
            operatorCard.className = 'operator-card';

            const name = document.createElement('h3');
            name.textContent = operator.name;

            const primarySkill = operator.stats[0]
                .replace(/[-–]\s*/, '')
                .trim();

            const secondarySkill = operator.stats[1]
                .replace(/[-–]\s*/, '')
                .trim();

            const primary = document.createElement('p');
            primary.innerHTML = `<strong>Primary:</strong> ${primarySkill}`;

            const secondary = document.createElement('p');
            secondary.innerHTML = `<strong>Secondary:</strong> ${secondarySkill}`;

            operatorCard.appendChild(name);
            operatorCard.appendChild(primary);
            operatorCard.appendChild(secondary);

            letterSection.appendChild(operatorCard);
        });

        container.appendChild(letterSection);
    });
}


// =============================================
// Search Listener (Live Filtering)
// =============================================

function setupSearchListener() {

    const searchInput = document.getElementById('search-input');

    const clearButton = document.getElementById('clear-search');

    // Show/hide X button based on input
    searchInput.addEventListener('input', () => {

        if (searchInput.value.length > 0) {
            clearButton.style.display = 'block';
        } else {
            clearButton.style.display = 'none';
        }

        renderOperators();
    });

    // Clear button click behavior
    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        clearButton.style.display = 'none';
        searchInput.focus();
        renderOperators();
    });    
}

// =============================================
// Initialize App After DOM Loads
// =============================================

document.addEventListener("DOMContentLoaded", () => {

    // Back To Top Button Setup
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {

        // Show button after scrolling 300px
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.style.display = 'block';
            } else {
                backToTopButton.style.display = 'none';
            }
        });

        // Scroll to top when clicked
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Load operator data after DOM exists
    loadOperators();

});