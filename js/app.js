// =============================================
// Global Variables
// =============================================

let operatorData = [];      // Stores JSON data
let activeTeamSlot = null; // Tracks which slot we're editing

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
// Tab Switching
// =============================================

const tabButtons = document.querySelectorAll('.tab-button');
const mainTab = document.getElementById('main-tab');
const teamsTab = document.getElementById('teams-tab');

tabButtons.forEach(button => {

    button.addEventListener('click', () => {

        // Remove active state
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const selectedTab = button.dataset.tab;

        if (selectedTab === "main") {
            mainTab.classList.remove('hidden');
            teamsTab.classList.add('hidden');
        } else {
            mainTab.classList.add('hidden');
            teamsTab.classList.remove('hidden');
        }

    });

});

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
            operatorCard.className = 'operator-card fade-in';

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
// Render Teams
// =============================================

function renderTeams() {

    const container = document.getElementById('teams-container');
    container.innerHTML = '';

    for (let i = 1; i <= 5; i++) {

        const teamSection = document.createElement('div');
        teamSection.className = 'team-section';

        const title = document.createElement('h2');
        title.textContent = `Team ${String(i).padStart(2, '0')}`;

        teamSection.appendChild(title);

        const slotContainer = document.createElement('div');
        slotContainer.className = 'team-slots';

        for (let s = 1; s <= 4; s++) {

            const slot = document.createElement('div');
            slot.className = 'team-slot';

            slot.innerHTML = `
                <div>Empty Slot</div>
                <button class="add-operator-btn">Add Operator</button>
            `;

            const button = slot.querySelector('button');
            button.addEventListener('click', () => openModal(slot));

            slotContainer.appendChild(slot);
        }

        teamSection.appendChild(slotContainer);
        container.appendChild(teamSection);
    }
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
// Open Modal
// =============================================

function openModal(slotElement) {

    activeTeamSlot = slotElement;

    const modal = document.getElementById('operator-modal');
    const modalList = document.getElementById('modal-operator-list');
    const searchInput = document.getElementById('modal-search');

    modal.classList.remove('hidden');
    searchInput.value = '';
    modalList.innerHTML = '';

    renderModalOperators('');

    searchInput.focus();

    searchInput.oninput = () => {
        renderModalOperators(searchInput.value.toLowerCase());
    };
}


// =============================================
// Close Modal
// =============================================

function closeModal() {
    document.getElementById('operator-modal').classList.add('hidden');
    activeTeamSlot = null;
}


// =============================================
// Render Operators Inside Modal
// =============================================

function renderModalOperators(searchValue) {

    const modalList = document.getElementById('modal-operator-list');
    modalList.innerHTML = '';

    operatorData.forEach(group => {

        group.operators.forEach(operator => {

            if (!operator.name.toLowerCase().includes(searchValue)) return;

            const item = document.createElement('div');
            item.className = 'modal-operator';
            item.textContent = operator.name;

            item.addEventListener('click', () => {
                assignOperatorToSlot(operator);
                closeModal();
            });

            modalList.appendChild(item);

        });

    });
}


// =============================================
// Assign Operator To Slot
// =============================================

function assignOperatorToSlot(operator) {

    if (!activeTeamSlot) return;

    activeTeamSlot.innerHTML = `
        <div>
            <strong>${operator.name}</strong><br>
            Primary: ${operator.stats[0]}<br>
            Secondary: ${operator.stats[1]}
        </div>
        <button class="add-operator-btn">Change Operator</button>
    `;

    const button = activeTeamSlot.querySelector('button');
    button.addEventListener('click', () => openModal(activeTeamSlot));
}

// =============================================
// Initialize App After DOM Loads
// =============================================

document.addEventListener("DOMContentLoaded", () => {

    // =============================================
    // Back To Top Button Setup
    // =============================================
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

    // =============================================
    // Modal Handler
    // =============================================

    document.getElementById('operator-modal')
    .addEventListener('click', (e) => {
        if (e.target.id === 'operator-modal') {
            closeModal();
        }
    });

    // =============================================
    // Load Version From Config
    // =============================================

    async function loadVersion() {
        try {
            const response = await fetch('data/config.json');
            const config = await response.json();

            const versionElement = document.querySelector('.version');
            if (versionElement && config.version) {
                versionElement.textContent = `v${config.version}`;
            }

        } catch (error) {
            console.error("Error loading config:", error);
        }
    }

    // Load any data after DOM exists
    loadVersion();
    loadOperators();
    renderTeams();

});