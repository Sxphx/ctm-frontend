let buildingsList = [
    {
        name: "Water Treatment",
        id: "waterTreatment",
        owned: false,
        cost: { money: 35, energy: 5, water: 0, food: 0, happiness: 0 },
        effects: { water: 4 },
        description: "Produces 4 water per action"
    },
    {
        name: "Power Plant",
        id: "powerPlant",
        owned: false,
        cost: { money: 40, water: 15, energy: 0, food: 0, happiness: 0 },
        effects: { energy: 6 },
        description: "Produces 6 energy per action"
    },
    {
        name: "Farm",
        id: "farm",
        owned: false,
        cost: { money: 30, water: 20, energy: 10, food: 0, happiness: 0 },
        effects: { food: 5 },
        description: "Produces 5 food per action"
    },
    {
        name: "Park",
        id: "park",
        owned: false,
        cost: { money: 25, water: 10, energy: 0, food: 0, happiness: 0 },
        effects: { happiness: 2 },
        description: "Increases happiness by 2 per action"
    },
    {
        name: "Market",
        id: "market",
        owned: false,
        cost: { money: 45, water: 0, energy: 10, food: 5, happiness: 0 },
        effects: { money: 2, happiness: 1 },
        description: "Generates 2 money and 1 happiness per action"
    }
];


function buildingListUI() {
    const buildingListElement = document.getElementById('building-list');
    if (!buildingListElement) reaction;

    buildingListElement.innerHTML = '';

    const rowDiv = document.createElement('div');
    rowDiv.className = 'row g-3';

    for (const building of buildingsList) {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-md-6';

        const cardDiv = document.createElement('div');
        cardDiv.className = 'card h-100';

        const cardBodyDiv = document.createElement('div');
        cardBodyDiv.className = 'card-body';

        cardBodyDiv.innerHTML = `
            <h5 class="card-title">${building.name}</h5>
            <p class="card-text">${building.description}</p>
            <div class="d-grid gap-2">
                <p>
                    Cost: ${building.cost.money ? `${building.cost.money} money` : ''}${building.cost.water ? `, ${building.cost.water} water` : ''}${building.cost.energy ? `, ${building.cost.energy} energy` : ''}${building.cost.food ? `, ${building.cost.food} food` : ''}${building.cost.happiness ? `, ${building.cost.happiness} happiness` : ''}
                </p>
                <button class="btn btn-primary" id="building-${building.id}" onclick="buildingBuy('${building.id}')">
                    Build
                </button>
                <button class="btn btn-success" id="building-${building.id}-Owned" style="display: none;">
                    Built
                </button>
            </div>
        `;

        cardDiv.appendChild(cardBodyDiv);
        colDiv.appendChild(cardDiv);
        rowDiv.appendChild(colDiv);
    }

    buildingListElement.appendChild(rowDiv);
}

function buildingBuy(buildingId) {
    console.log(`Buying building: ${buildingId}`);
    const building = buildingsList.find(building => building.id === buildingId);
    if (availableSpace <= 0) {
        showAlert("error", "Building Failed", "No more space available for buildings.");
        return;
    }
    else if (building) {
        for (const [resource, amount] of Object.entries(building.cost)) {
            if (resource === 'money') money -= amount;
            if (resource === 'water') water -= amount;
            if (resource === 'energy') energy -= amount;
            if (resource === 'food') food -= amount;
            if (resource === 'happiness') happiness -= amount;
        }
    }
    building.owned = true;
    availableSpace -= 1;
    console.log(`availableSpace: ${availableSpace}`);
    showAlert("success", "Building Purchased", `You have successfully purchased the ${building.name}.`);
    updateStats();
    updateBuildingUI(buildingId);
}

function updateBuildingUI(buildingId) {
    console.log(`Updating building UI: ${buildingId}`);
    for (const building of buildingsList) {
        if (building.id === buildingId) {
            const buildingElement = document.getElementById(`building-${building.id}`);
            const buildingOwnedElement = document.getElementById(`building-${building.id}-Owned`);

            if (!buildingElement || !buildingOwnedElement) {
                console.error(`UI element not found for building: ${building.id}`);
                reaction;
            }

            if (building.owned) {
                buildingElement.style.display = 'none';
                buildingOwnedElement.style.display = 'block';
            } else {
                buildingElement.style.display = 'block';
                buildingOwnedElement.style.display = 'none';
            }
        }
    }
}

function applyBuildingEffects() {
    for (const building of buildingsList) {
        if (building.owned) {
            switch (building.name) {
                case "Water Treatment":
                    water += 4;
                    break;
                case "Power Plant":
                    energy += 6;
                    break;
                case "Farm":
                    food += 5;
                    break;
                case "Park":
                    happiness += 2;
                    break;
                case "Market":
                    money += 2;
                    happiness += 1;
                    break;
            }
        }
    }
}



buildingListUI();
