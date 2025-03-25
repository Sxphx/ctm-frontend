let researchList = [
    { name: "Water Purification", id: "waterPurification", owned: false, cost: 50, description: "Reduces water consumption by 15%" },
    { name: "Solar Panels", id: "solarPanels", owned: false, cost: 60, description: "Increases energy production by 10%" },
    { name: "Farm", id: "Farm", owned: false, cost: 75, description: "Increases food production by 15%" },
    { name: "Public Transport", id: "publicTransport", owned: false, cost: 90, description: "Increases happiness by 8%" },
    { name: "Automation", id: "automation", owned: false, cost: 100, description: "Reduces resource costs by 10%" }
];

function researchPointUpdate() {
    const researchPointElement = document.getElementById('researchPoint');
    researchPointElement.textContent = researchPoint;
}
function researchListUI() {
    researchPointUpdate();
    const researchListElement = document.getElementById('research-list');
    if (!researchListElement) return;

    researchListElement.innerHTML = '';

    const rowDiv = document.createElement('div');
    rowDiv.className = 'row g-3';

    for (const research of researchList) {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-md-6'; 

        const cardDiv = document.createElement('div');
        cardDiv.className = 'card h-100'; 

        const cardBodyDiv = document.createElement('div');
        cardBodyDiv.className = 'card-body';

        cardBodyDiv.innerHTML = `
            <h5 class="card-title">${research.name}</h5>
            <p class="card-text">${research.description}</p>
            <div class="d-grid gap-2">
                <button class="btn btn-primary" id="research-${research.name}" onclick="researchBuy('${research.id}')">
                    Research (${research.cost} <i class="fa-solid fa-dna"></i> TP)
                </button>
                <button class="btn btn-success" id="research-${research.name}-Owned" style="display: none;">
                    Researched
                </button>
            </div>
        `;

        if (research.owned) {
            const buyButton = cardBodyDiv.querySelector(`#research-${research.name}`);
            const ownedButton = cardBodyDiv.querySelector(`#research-${research.name}-Owned`);
            if (buyButton) buyButton.style.display = 'none';
            if (ownedButton) ownedButton.style.display = 'block';
        }

        cardDiv.appendChild(cardBodyDiv);
        colDiv.appendChild(cardDiv);
        rowDiv.appendChild(colDiv);
    }

    researchListElement.appendChild(rowDiv);
}

function researchBuy(researchId) {
    for (const research of researchList) {
        if (research.id === researchId) {
            if (researchPoint >= research.cost) {
                research.owned = true;
                researchPoint -= research.cost;
                updateResearchUI(researchId);
                showAlert("success", "Technology Researched", `You've successfully researched ${researchId}`);
                researchPointUpdate()
                return;
            }
            else {
                showAlert("error", "Not Enough Tech Points", `You need ${research.cost} tech points to research this technology.`);
                return;
            }
        }
    }
}

function updateResearchUI(researchId) {
    for (const research of researchList) {
        if (research.id === researchId) {
            const researchElement = document.getElementById(`research-${research.name}`);
            const researchOwnedElement = document.getElementById(`research-${research.name}-Owned`);

            if (research.owned) {
                researchElement.style.display = 'none';
                researchOwnedElement.style.display = 'block';
            } else {
                researchElement.style.display = 'block';
                researchOwnedElement.style.display = 'none';
            }
        }
    }
}
function researchPointsEarn() {
    const basePoints = Math.max(1, Math.floor(action / 8));
    const populationBonus = Math.floor(Math.sqrt(population) / 2);
    const happinessBonus = Math.floor(happiness / 25);

    const newPoints = basePoints + populationBonus + happinessBonus;
    researchPoint += newPoints;
    researchPointUpdate();
    console.log(`Research Points: +${newPoints} (Base: ${basePoints}, Pop: ${populationBonus}, Happy: ${happinessBonus})`);

    return newPoints;
}

researchListUI();