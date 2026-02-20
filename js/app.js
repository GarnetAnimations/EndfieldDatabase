// =============================================
// Load and Render Operators from JSON
// =============================================

// This function loads the JSON file and renders
// all operator groups (A-Z) onto the page.
async function loadOperators() {

    try {
        // -----------------------------------------
        // 1. Fetch the JSON data
        // -----------------------------------------
        const response = await fetch('data/characterData.json');

        // Convert the response into usable JSON
        const data = await response.json();


        // -----------------------------------------
        // 2. Grab the container in index.html
        // -----------------------------------------
        const container = document.getElementById('operator-list');

        // Clear anything currently inside it
        container.innerHTML = '';


        // -----------------------------------------
        // 3. Loop Through Each Letter Group
        // -----------------------------------------
        data.forEach(group => {

            // Create a section wrapper for this letter
            const letterSection = document.createElement('div');
            letterSection.className = 'letter-section';

            // Create a heading for the letter (A, B, C, etc.)
            const letterHeading = document.createElement('h2');
            letterHeading.textContent = group.letter_group;

            letterSection.appendChild(letterHeading);


            // -----------------------------------------
            // 4. Loop Through Operators in This Group
            // -----------------------------------------
            group.operators.forEach(operator => {

                // Create a card/container for each operator
                const operatorCard = document.createElement('div');
                operatorCard.className = 'operator-card';


                // Operator Name
                const name = document.createElement('h3');
                name.textContent = operator.name;


                // -----------------------------------------
                // 5. Extract Primary & Secondary Skills
                // -----------------------------------------

                // Remove any leading dash characters and trim whitespace
                const primarySkill = operator.stats[0].replace(/[-–]\s*/, '').trim();
                const secondarySkill = operator.stats[1].replace(/[-–]\s*/, '').trim();


                // Create skill paragraphs
                const primary = document.createElement('p');
                primary.innerHTML = `<strong>Primary:</strong> ${primarySkill}`;

                const secondary = document.createElement('p');
                secondary.innerHTML = `<strong>Secondary:</strong> ${secondarySkill}`;


                // -----------------------------------------
                // 6. Append Everything Together
                // -----------------------------------------

                operatorCard.appendChild(name);
                operatorCard.appendChild(primary);
                operatorCard.appendChild(secondary);

                letterSection.appendChild(operatorCard);
            });


            // Finally add this letter section to the page
            container.appendChild(letterSection);
        });

    } catch (error) {
        console.error("Error loading operator data:", error);
    }
}


// Run the function when the page loads
loadOperators();