let tradeRate = [
    { resource: 'water', rate: 0.7 },
    { resource: 'energy', rate: 0.7 },
    { resource: 'food', rate: 0.7 }
];


function tradeRateUpdate() {
    console.log('Updating trade rates...');
    tradeRate.forEach(rate => {
        console.log(`Updating rate for ${rate.resource}: ${rate.rate}`);
        document.getElementById(`trade-${rate.resource}-rate`).innerHTML = rate.rate;
    });
    console.log('Trade rates updated successfully.');
}

function tradePopup(type) {
    console.log(`Trade popup for ${type} resource...`);
    document.getElementById('typeTrade').innerHTML = type.charAt(0).toUpperCase() + type.slice(1);
    document.getElementById('typeOfTrade').value = type;

    const resourceRate = tradeRate.find(item => item.resource === type).rate;
    document.getElementById('trade-rate').innerHTML = `Rate: ${resourceRate}`;

    document.getElementById('trade-amount').value = '';
    document.getElementById('trade-total-value').innerHTML = '0';

    document.getElementById('trade-amount').addEventListener('input', function () {
        calculateTradeTotal(type);
    });

    const tradePopupModal = new bootstrap.Modal(document.getElementById('tradePopupModal'));
    tradePopupModal.show();
}

function calculateTradeTotal(type, amount = document.getElementById('trade-amount').value) {
    console.log(`Calculating trade total for ${type} resource...`);
    const resourceRate = tradeRate.find(item => item.resource === type).rate;

    if (!isNaN(amount) && amount !== '') {
        const ftotal = parseFloat(amount) * resourceRate;
        total = Math.floor(ftotal * 100) / 100;
        document.getElementById('trade-total-value').innerHTML = total.toFixed(2);
        return total;
    } else {
        document.getElementById('trade-total-value').innerHTML = '0';
        return 0;
    }
}

function tradeConfirm(amount, type) {
    console.log(`Confirming trade of ${amount} ${type} for a total of ${calculateTradeTotal(type, amount)}`);
    sendTradeRequest(type, amount, calculateTradeTotal(type, amount));
}

function sendTradeRequest(type, amount, total) {
    console.log(`Sending trade request for ${amount} ${type} for a total of ${total}`);
    const resource = getResource(type);
    console.log(`Current ${type} resource: ${resource} total: ${total}`);
    if (resource >= amount) {
        const resourceAfterTrade = resource - amount;
        console.log(resource - amount)
        document.getElementById(type).innerHTML = resourceAfterTrade.toFixed(2);
        money += total;
        if (type === 'water') water = resourceAfterTrade;
        else if (type === 'energy') energy = resourceAfterTrade;
        else if (type === 'food') food = resourceAfterTrade;
        document.getElementById('money').innerHTML = money.toFixed(2);
        document.getElementById('trade-amount').value = '';
        document.getElementById('trade-total-value').innerHTML = '0';

        console.log('current money: ' + money, "current resource: " + resource);
        updateStats();
    } else {
        document.getElementById('trade-amount').value = '';
        document.getElementById('trade-total-value').innerHTML = '0';
        console.log(`Not enough ${type} to buy ${amount} ${type}`);
        showAlert('error', `Not Enough ${type.charAt(0).toUpperCase() + type.slice(1)}`, `You need ${amount} ${type} to complete this trade.`);
        updateStats();
    }
}

function getResource(type) {
    console.log(`Getting resource value for ${type}...`);
    switch (type) {
        case 'water':
            return water;
        case 'energy':
            return energy;
        case 'food':
            return food;
        default:
            console.log(`Invalid trade type: ${type}`);
            return 0;
    }
}

