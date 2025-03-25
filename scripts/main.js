

function checkForValidMoves() {
    if (water <= 0 && energy <= 0 && food <= 0) {
        return false;
    }

    const canInvestWater = money >= 20 * (1 - checkAutomation());
    const canBuildEnergy = money >= 25 * (1 - checkAutomation()) && water >= 15;
    const canHarvestFood = water >= 20 && energy >= 15;
    const canExpandCity = money >= 50 * (1 - checkAutomation());

    if (water <= 0 || energy <= 0 || food <= 0) {
        return false;
    }

    if (!canInvestWater && !canBuildEnergy && !canHarvestFood && !canExpandCity) {
        if (water < 10 && energy < 10 && food < 10 && money < 20) {
            return false;
        }
    }

    return true;
}


function makeTable() {
    const table = document.createElement("table");
    const tbody = document.createElement("tbody");
    for (let i = 0; i < 3; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < 3; j++) {
            const td = document.createElement("td");
            td.id = `cell-${i}-${j}`;
            imgtd = document.createElement("img");
            imgtd.src = "/img/Ground.png";
            imgtd.id = "ground";
            imgtd.className = "city";
            tr.appendChild(td);
            td.appendChild(imgtd);
        }
        tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    const container = document.getElementById("table-container");
    container.appendChild(table);
}

makeTable();

function checkResourceShortages() {
    let criticalShortages = 0;

    if (water <= 0) {
        water = 0;
        happiness -= 10;
        criticalShortages++;
        showAlert("warning", "Water Shortage", "Your city is experiencing a water shortage! Happiness is decreasing rapidly.");
    }

    if (energy <= 0) {
        energy = 0;
        happiness -= 8;
        criticalShortages++;
        showAlert("warning", "Energy Shortage", "Your city is experiencing power outages! Happiness is decreasing.");
    }

    if (food <= 0) {
        food = 0;
        happiness -= 15;
        population = Math.max(0, population - 5);
        criticalShortages++;
        showAlert("warning", "Food Shortage", "Your city is experiencing a food shortage! Population is decreasing and happiness is plummeting.");
    }

    if (criticalShortages >= 3 || happiness <= 0 || population <= 0) {
        gameOver();
        return false;
    }

    return true;
}

function gameOver() {
    let gameOverReason = "";

    if (happiness <= 0) {
        gameOverReason = "Your citizens are extremely unhappy and have revolted!";
    } else if (population <= 0) {
        gameOverReason = "Your city has been abandoned due to poor living conditions!";
    } else if (water <= 0 && energy <= 0 && food <= 0) {
        gameOverReason = "Your city has run out of all critical resources!";
    } else {
        gameOverReason = "You've run out of resources and have no valid moves left!";
    }

    document.getElementById('final-score').textContent = Math.floor(score);
    document.getElementById('game-over-reason').textContent = gameOverReason;

    const gameOverModal = new bootstrap.Modal(document.getElementById('gameOverModal'));
    gameOverModal.show();

    const actionButtons = document.querySelectorAll('#bottom-menu button');
    actionButtons.forEach(button => {
        if (!button.getAttribute('data-bs-toggle')) {
            button.disabled = true;
        }
    });

    console.log("Game Over! Final Score: " + Math.floor(score));
    showAlert("error", "Game Over", gameOverReason);
    console.log(water, energy, food, population, money, happiness);
}



function makeDecision(decision) {
    console.log(`Making decision: ${decision}`);

    let waterMultiplier = 1 + (cityExpansion * 0.05);
    let energyMultiplier = 1 + (cityExpansion * 0.05);
    let foodMultiplier = 1 + (cityExpansion * 0.05);
    let reduceExpandCost = 1 + (cityExpansion * 0.05);

    console.log(`
        Water Multiplier: ${waterMultiplier}, 
        Energy Multiplier: ${energyMultiplier}, 
        Food Multiplier: ${foodMultiplier}, 
        Reduce Expand Cost: ${reduceExpandCost}`
    );

    if (!checkForValidMoves()) {
        showAlert("error", "No Valid Moves", "You have no valid moves left and insufficient resources to recover!");
        gameOver();
        return;
    }
    switch (decision) {
        case 'investWater':
            const waterCost = 20 * (1 - checkAutomation());
            if (money < waterCost) {
                showAlert("error", "Not enough money", `You need ${Math.ceil(waterCost)} money to invest in water infrastructure.`);
                return;
            }
            waterGet = 25 * (1 + checkWater()) * waterMultiplier
            water += waterGet;
            money -= waterCost;
            console.log(`Get water: ${waterGet}`);
            showAlert("success", "Water Infrastructure Improved", `Water supply has increased by ${waterGet}.`);
            break;

        case 'buildEnergy':
            const energyCost = 25 * (1 - checkAutomation());
            if (water < 15 || money < energyCost) {
                showAlert("error", "Insufficient resources", `You need 15 water and ${Math.ceil(energyCost)} money to build a power plant.`);
                return;
            }
            energyGet = 30 * (1 + checkSolar()) * energyMultiplier;
            energy += energyGet;
            water -= 15;
            money -= energyCost;
            showAlert("success", "Power Plant Built", `Energy production has increased by ${energyGet}.`);
            break;

        case 'harvestFood':
            if (water < 20 || energy < 15) {
                showAlert("error", "Insufficient resources", "You need 20 water and 15 energy to harvest food.");
                return;
            }
            water -= 20;
            energy -= 15;
            foodGet = 35 * (1 + checkFarm()) * foodMultiplier;
            food += foodGet;
            showAlert("success", "Food Harvested", `Food production has increased by ${foodGet}.`);
            break;

        case 'expandCity':
            const expansionCost = 50 * (1 - checkAutomation()) * reduceExpandCost;
            if (money < expansionCost) {
                showAlert("error", "Not enough money", `You need ${Math.ceil(expansionCost)} money to expand the city.`);
                return;
            } else if (availableSpace <= 0) {
                showAlert("error", "No available space", "No available space to expand the city.");
                return;
            }
            cityExpansion += 1;
            availableSpace -= 1;
            population += 15;
            happiness += 15 * (1 + checkTransport());
            money -= expansionCost;
            console.log(`Expansion cost: ${expansionCost}`);
            showAlert("success", "City Expansion", `Population and happiness have increased by ${15}.`);
            break;
    }

    const baseConsumption = 5;
    const populationFactor = 1 + (population / 100);

    const energyConsumed = baseConsumption + (5 * populationFactor);
    const foodConsumed = baseConsumption * populationFactor;
    const waterConsumed = baseConsumption * populationFactor;
    const happinessConsumed = 2;

    if (food < 75) {
        const happinessConsumed = baseConsumption * populationFactor;
    }

    energy -= energyConsumed;
    food -= foodConsumed;
    water -= waterConsumed;
    happiness -= happinessConsumed;

    console.log(`Consumption - Energy: ${energyConsumed}, Food: ${foodConsumed}, Water: ${waterConsumed}, Happiness: ${happinessConsumed}`);



    checkResourceShortages();
    if (!checkForValidMoves()) {
        showAlert("error", "No Valid Moves", "You have no valid moves left and insufficient resources to recover!");
        gameOver();
        return;
    }

    researchPointsEarn();
    generateIncome();
    randomEvent();
    action++;
    updateStats();
}

function checkResourceShortages() {
    if (water <= 0) {
        water = 0;
        happiness -= 10;
        showAlert("warning", "Water Shortage", "Your city is experiencing a water shortage! Happiness is decreasing rapidly.");
    }

    if (energy <= 0) {
        energy = 0;
        happiness -= 8;
        showAlert("warning", "Energy Shortage", "Your city is experiencing power outages! Happiness is decreasing.");
    }

    if (food <= 0) {
        food = 0;
        happiness -= 15;
        population = Math.max(0, population - 5);
        showAlert("warning", "Food Shortage", "Your city is experiencing a food shortage! Population is decreasing and happiness is plummeting.");
    }

    if (happiness <= 0 || population <= 0) {
        gameOver();
    }
}

function generateIncome() {
    const baseIncome = 5;
    const populationFactor = population / 50;
    const happinessFactor = happiness / 50;

    money += baseIncome * populationFactor * happinessFactor;

}



function checkWater() {
    const waterTech = researchList.find(r => r.id === "waterPurification");
    return waterTech && waterTech.owned ? 0.20 : 0;
}

function checkSolar() {
    const solarTech = researchList.find(r => r.id === "solarPanels");
    return solarTech && solarTech.owned ? 0.15 : 0;
}

function checkFarm() {
    const farmTech = researchList.find(r => r.id === "Farm");
    return farmTech && farmTech.owned ? 0.20 : 0;
}

function checkTransport() {
    const transportTech = researchList.find(r => r.id === "publicTransport");
    return transportTech && transportTech.owned ? 0.25 : 0;
}

function checkAutomation() {
    const autoTech = researchList.find(r => r.id === "automation");
    return autoTech && autoTech.owned ? 0.15 : 0;
}

