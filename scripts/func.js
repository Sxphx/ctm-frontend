updateStats();
function updateStats() {
  console.log("Updating Stats:");
  console.log(`Water: ${water}`);
  console.log(`Energy: ${energy}`);
  console.log(`Food: ${food}`);
  console.log(`Population: ${population}`);
  console.log(`Money: ${money}`);
  console.log(`Happiness: ${happiness}`);
  console.log(`City Expanded: ${cityExpansion}`);
  console.log(`Available Space: ${availableSpace}`);
  console.log(`Score: ${score}`);
  console.log(`Action: ${action}`);
  console.log("------------------------");

  document.getElementById("water").textContent = Math.max(0, Math.floor(water));
  document.getElementById("energy").textContent = Math.max(
    0,
    Math.floor(energy)
  );
  document.getElementById("food").textContent = Math.max(0, Math.floor(food));
  document.getElementById("population").textContent = Math.max(
    0,
    Math.floor(population)
  );
  document.getElementById("money").textContent = Math.max(0, Math.floor(money));
  document.getElementById("happiness").textContent = Math.min(
    100,
    Math.max(0, Math.floor(happiness))
  );
  document.getElementById("score").textContent = Math.floor(score);
  document.getElementById("action").textContent = action;

  updateResourceBar("water-bar", water, 200);
  updateResourceBar("energy-bar", energy, 200);
  updateResourceBar("food-bar", food, 200);
  updateResourceBar("population-bar", population, 100);
  updateResourceBar("money-bar", money, 200);
  updateResourceBar("happiness-bar", happiness, 100);

  if (document.getElementById("researchPoint")) {
    document.getElementById("researchPoint").textContent =
      Math.floor(researchPoint);
  }

  if (!checkForValidMoves()) {
    showAlert(
      "error",
      "No Valid Moves",
      "You have no valid moves left and insufficient resources to recover!"
    );
    gameOver();
    return;
  }

  incrementScore();
}

function updateResourceBar(id, value, max) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const bar = document.getElementById(id);
  bar.style.width = percentage + "%";

  bar.classList.remove("critical", "warning", "moderate", "good");

  if (percentage <= 20) {
    bar.classList.add("critical");
  } else if (percentage <= 40) {
    bar.classList.add("warning");
  } else if (percentage <= 60) {
    bar.classList.add("moderate");
  } else {
    bar.classList.add("good");
  }
}

function incrementScore() {
  const resourceScore = (water + energy + food + happiness) / 4;
  const populationFactor = Math.max(1, population / 10);
  const actionScore = Math.floor(resourceScore * (populationFactor / 10));

  score += actionScore;
  document.getElementById("score").textContent = score;
}
function gameOver() {
  sendScoreToServer(score);
  let gameOverReason = "";

  if (happiness <= 0) {
    gameOverReason = "Your citizens are extremely unhappy and have revolted!";
  } else if (population <= 0) {
    gameOverReason =
      "Your city has been abandoned due to poor living conditions!";
  } else if (water <= 0 && energy <= 0 && food <= 0) {
    gameOverReason = "Your city has run out of all critical resources!";
  } else if (surrender === true) {
    gameOverReason = "You have surrendered!";
  } else {
    gameOverReason =
      "You've run out of resources and have no valid moves left!";
  }

  document.getElementById("final-score").textContent = Math.floor(score);
  document.getElementById("game-over-reason").textContent = gameOverReason;

  const gameOverModal = new bootstrap.Modal(
    document.getElementById("gameOverModal")
  );
  gameOverModal.show();

  const actionButtons = document.querySelectorAll("#bottom-menu button");
  actionButtons.forEach((button) => {
    if (!button.getAttribute("data-bs-toggle")) {
      button.disabled = true;
    }
  });

  console.log("Game Over! Final Score: " + Math.floor(score));
  showAlert("error", "Game Over", gameOverReason);
  surrender = false;
  console.log(water, energy, food, population, money, happiness);
}

function restart() {
  location.reload();
}

function surrender() {
  surrender = true;
  gameOver();
}
