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

            // Toggle behavior
            if (currentLetter === letter) {
                currentLetter = null;
                button.classList.remove('active');
            } else {
                currentLetter = letter;

                // Remove active from all buttons
                document.querySelectorAll('#alphabet-filter button')
                    .forEach(btn => btn.classList.remove('active'));

                button.classList.add('active');
            }

            renderOperators();
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

    searchInput.addEventListener('input', () => {
        renderOperators();
    });
}


// =============================================
// Initialize App
// =============================================

loadOperators();