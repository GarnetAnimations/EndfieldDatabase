// =============================================
// Global Variables
// =============================================

let operatorData = [];      // Stores JSON data

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

document.addEventListener("DOMContentLoaded", () => {

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

                renderTeams();
                attachEquipmentListeners();
            }

        });

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
// Currently Selected Slot
// =============================================

let currentTeamIndex = null;
let currentSlotIndex = null;

// =============================================
// Team State
// =============================================

const TEAM_COUNT = 5;
const SLOT_COUNT = 4;

// 5 teams, each with 4 slots
let teams = Array.from({ length: TEAM_COUNT }, () =>
    Array.from({ length: SLOT_COUNT }, () => ({
        operator: null,
        equipment: {
            armor: "",
            gloves: "",
            kit1: "",
            kit2: ""
        }
    }))
);
// =============================================
// Render Teams
// =============================================

function renderTeams() {

    const container = document.getElementById('teams-container');
    container.innerHTML = '';

    for (let teamIndex = 0; teamIndex < TEAM_COUNT; teamIndex++) {

        const teamSection = document.createElement('div');
        teamSection.className = 'team-section';

        const title = document.createElement('h2');
        title.textContent = `Team ${String(teamIndex + 1).padStart(2, '0')}`;

        teamSection.appendChild(title);

        const slotContainer = document.createElement('div');
        slotContainer.className = 'team-slots';

        for (let slotIndex = 0; slotIndex < SLOT_COUNT; slotIndex++) {

            const slotData = teams[teamIndex][slotIndex];

            const slot = document.createElement('div');
            slot.className = 'team-slot';

            if (!slotData.operator) {

                slot.innerHTML = `
                    <div>Empty Slot</div>
                    <button class="add-operator-btn">Add Operator</button>
                `;

                slot.querySelector('button')
                    .addEventListener('click', () => {
                        openModal(teamIndex, slotIndex);
                    });

            } else {

                slot.innerHTML = `
                    <div class="operator-name">${slotData.operator.name}</div>
                    <div class="operator-info">
                        Primary: ${slotData.operator.primary}
                        <br>
                        Secondary: ${slotData.operator.secondary}
                    </div>

                    <div class="equipment-section">
                        ${renderEquipmentFields(teamIndex, slotIndex)}
                    </div>

                    <button class="change-operator-btn">Change Operator</button>
                `;

                slot.querySelector('.change-operator-btn')
                    .addEventListener('click', () => {
                        openModal(teamIndex, slotIndex);
                    });
            }

            slotContainer.appendChild(slot);
        }

        teamSection.appendChild(slotContainer);
        container.appendChild(teamSection);
    }
}

// =============================================
// Create Equipment Fields
// =============================================

function createEquipmentField(label, key, value, teamIndex, slotIndex) {

    return `
        <div class="equipment-item">
            <label>${label}</label>
            <input 
                type="text"
                value="${value}"
                data-team="${teamIndex}"
                data-slot="${slotIndex}"
                data-key="${key}"
                class="equipment-input"
            />
        </div>
    `;
}

// =============================================
// Render Equipment Inputs
// =============================================

function renderEquipmentFields(teamIndex, slotIndex) {

    const equip = teams[teamIndex][slotIndex].equipment;

    return `
        ${createEquipmentField("Armor", "armor", equip.armor, teamIndex, slotIndex)}
        ${createEquipmentField("Gloves", "gloves", equip.gloves, teamIndex, slotIndex)}
        ${createEquipmentField("Kit 1", "kit1", equip.kit1, teamIndex, slotIndex)}
        ${createEquipmentField("Kit 2", "kit2", equip.kit2, teamIndex, slotIndex)}
    `;
}

// =============================================
// Equipment Input Handlers
// =============================================

function attachEquipmentListeners() {

    const inputs = document.querySelectorAll('.equipment-input');

    inputs.forEach(input => {

        input.addEventListener('input', (e) => {

            const teamIndex = e.target.dataset.team;
            const slotIndex = e.target.dataset.slot;
            const key = e.target.dataset.key;

            teams[teamIndex][slotIndex].equipment[key] = e.target.value;

            saveTeams();
        });

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
// Open Modal
// =============================================

function openModal(teamIndex, slotIndex) {

    currentTeamIndex = teamIndex;
    currentSlotIndex = slotIndex;

    const modal = document.getElementById('operator-modal');
    const searchInput = document.getElementById('modal-search');

    modal.classList.remove('hidden');
    searchInput.value = '';

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
    currentTeamIndex = null;
    currentSlotIndex = null;
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
                selectOperator(operator);
            });

            modalList.appendChild(item);

        });

    });
}

// =============================================
// Select Operator From Modal
// =============================================

function selectOperator(operator) {

    if (currentTeamIndex === null || currentSlotIndex === null) return;

    teams[currentTeamIndex][currentSlotIndex].operator = {
        name: operator.name,
        primary: operator.stats[0],
        secondary: operator.stats[1]
    };

    saveTeams();
    closeModal();
    renderTeams();
}

// =============================================
// Save / Load Teams
// =============================================

function saveTeams() {
    localStorage.setItem("operatorTeams", JSON.stringify(teams));
}

function loadTeams() {
    const saved = localStorage.getItem("operatorTeams");

    if (saved) {
        teams = JSON.parse(saved);
    }
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
    loadTeams();

});