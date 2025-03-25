const events = [
    {
        name: "Drought",
        description: "A drought has hit your region!",
        effect: () => {
            water -= 30;
            showAlert(
                "warning",
                "A drought has hit your region!",
                "Drought : Water -30."
            );
        }
    },
    {
        name: "Power Surge",
        description: "A power surge has damaged some infrastructure!",
        effect: () => {
            energy -= 25;
            showAlert(
                "warning",
                "A power surge has damaged some infrastructure!",
                "Power Surge : Energy -25."
            );
        }
    },
    {
        name: "Bountiful Harvest",
        description: "Favorable conditions have led to a bountiful harvest!",
        effect: () => {
            food += 40;
            showAlert(
                "warning",
                "Bountiful Harvest",
                "Favorable conditions have led to a bountiful harvest!",
                "Food supplies have increased : Food +40."
            );
        }
    },
    {
        name: "Economic Boom",
        description: "Your city is experiencing an economic boom!",
        effect: () => {
            money += 50;
            happiness += 10;
            showAlert(
                "warning",
                "Economic Boom",
                "Your city is experiencing an economic boom!.",
                "Economic Boom : Money +50, Happiness +10.");
        }
    },
    {
        name: "Eureka!",
        description: "Your researchers have made a breakthrough!",
        effect: () => {
            researchPoint += 20;
            showAlert(
                "warning",
                "Your researchers have made a breakthrough!",
                "Eureka! : Research Points +20",
            );
        }
    }
];

function protest() {
    const ownedBuildings = buildingsList.filter(b => b.owned);
    const randomIndex = Math.floor(Math.random() * ownedBuildings.length);
    const building = ownedBuildings[randomIndex];
    building.owned = false;
    updateBuildingUI(building.id);
    showAlert(
        "error",
        "Protest",
        "A group of angry citizens has destroyed a building!",
        "Building destroyed : " + building.name
    );

    population -= 5;
    happiness -= 5;
    updateStats();
}

function randomEvent() {
    if (Math.random() < 0.1) {
        const event = events[Math.floor(Math.random() * events.length)];
        event.effect();
        console.log(`Random Event: ${event.name}`);

    }

    const protestChance = 0.05 + (population / 1000) * 0.01 - (happiness / 100) * 0.005;
    console.log("Protest Chance", protestChance);

    if (Math.random() < protestChance && happiness < 65) {
        console.log("Math Random", Math.random());
        protest();
    }
}