let items = ['Ana', 'Bruno', 'Carlos', 'Diana', 'Eduardo', 'Fernanda'];
let drawnItems = [];
let isSpinning = false;
let lastWinnerToRemove = null;

const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');
const result = document.getElementById('result');
const itemInput = document.getElementById('itemInput');
const addBtn = document.getElementById('addBtn');
const itemsList = document.getElementById('itemsList');
const drawnItemsContainer = document.getElementById('drawnItems');
const removeAfterDrawCheckbox = document.getElementById('removeAfterDraw');
const restoreBtn = document.getElementById('restoreBtn');

const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', 
    '#DDA0DD', '#98D8E8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D2B4DE'
];

const presets = {
    numbers: ['1', '2', '3', '4', '5', '6', '7', '8'],
    people: ['Ana', 'Bruno', 'Carlos', 'Diana', 'Eduardo', 'Fernanda', 'Gabriel', 'Helena', 'Igor', 'Júlia'],
    food: ['Pizza', 'Hambúrguer', 'Sushi', 'Tacos', 'Sorvete', 'Salada', 'Pasta', 'Frango'],
    activities: ['Cinema', 'Parque', 'Praia', 'Shopping', 'Restaurante', 'Casa', 'Esportes', 'Leitura']
};

function updateWheel() {
    wheel.innerHTML = '';
    
    if (items.length === 0) {
        const noItemsDiv = document.createElement('div');
        noItemsDiv.className = 'no-items-message';
        noItemsDiv.innerHTML = `
            <span class="emoji">🎯</span>
            Adicione itens para girar a roleta!
        `;
        wheel.appendChild(noItemsDiv);
        wheel.style.background = 'transparent';
        return;
    }

    wheel.style.background = '';
    
    if (items.length === 1) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 400 400');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '200');
        circle.setAttribute('cy', '200');
        circle.setAttribute('r', '190');
        circle.setAttribute('fill', colors[0]);
        circle.setAttribute('stroke', 'rgba(255, 255, 255, 0.3)');
        circle.setAttribute('stroke-width', '2');
        
        svg.appendChild(circle);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '200');
        text.setAttribute('y', '200');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-family', 'Arial, sans-serif');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('font-size', '24px');
        text.textContent = items[0];
        
        svg.appendChild(text);
        wheel.appendChild(svg);
        return;
    }

    const anglePerSegment = 360 / items.length;
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 400 400');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    
    const centerX = 200;
    const centerY = 200;
    const radius = 190;
    
    items.forEach((item, index) => {
        const startAngle = (index * anglePerSegment - 90) * (Math.PI / 180);
        const endAngle = ((index + 1) * anglePerSegment - 90) * (Math.PI / 180);
        
        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);
        
        const largeArc = anglePerSegment > 180 ? 1 : 0;
        
        const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
            'Z'
        ].join(' ');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', colors[index % colors.length]);
        path.setAttribute('stroke', 'rgba(255, 255, 255, 0.3)');
        path.setAttribute('stroke-width', '2');
        
        svg.appendChild(path);
        
        const textAngle = (startAngle + endAngle) / 2;
        const textRadius = radius * 0.7;
        const textX = centerX + textRadius * Math.cos(textAngle);
        const textY = centerY + textRadius * Math.sin(textAngle);
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', textX);
        text.setAttribute('y', textY);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-family', 'Arial, sans-serif');
        text.setAttribute('font-weight', 'bold');
        
        let fontSize;
        if (items.length <= 6) {
            fontSize = '18px';
        } else if (items.length <= 10) {
            fontSize = '16px';
        } else {
            fontSize = '14px';
        }
        text.setAttribute('font-size', fontSize);
        
        const rotationAngle = (textAngle * 180 / Math.PI);
        if (rotationAngle > 90 && rotationAngle < 270) {
            text.setAttribute('transform', `rotate(${rotationAngle + 180} ${textX} ${textY})`);
        } else {
            text.setAttribute('transform', `rotate(${rotationAngle} ${textX} ${textY})`);
        }
        
        text.textContent = item;
        svg.appendChild(text);
    });
    
    wheel.appendChild(svg);
}

function updateItemsList() {
    itemsList.innerHTML = '';
    
    items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.innerHTML = `
            <span style="color: ${colors[index % colors.length]}; font-weight: bold;">●</span>
            <span>${item}</span>
            <button class="remove-btn" data-index="${index}">Remover</button>
        `;
        itemsList.appendChild(itemDiv);
    });
}

function addItem() {
    const newItem = itemInput.value.trim();
    if (newItem && items.length < 15) {
        items.push(newItem);
        itemInput.value = '';
        updateWheel();
        updateItemsList();
    }
}

function removeItem(index) {
    items.splice(index, 1);
    updateWheel();
    updateItemsList();
}

function loadPreset(presetName) {
    items = [...presets[presetName]];
    drawnItems = [];
    lastWinnerToRemove = null;
    updateWheel();
    updateItemsList();
    updateDrawnItems();
    result.style.display = 'none';
}

function clearList() {
    items = [];
    drawnItems = [];
    lastWinnerToRemove = null;
    updateWheel();
    updateItemsList();
    updateDrawnItems();
    result.style.display = 'none';
}

function updateDrawnItems() {
    drawnItemsContainer.innerHTML = '';
    
    if (drawnItems.length === 0) {
        drawnItemsContainer.innerHTML = '<p class="no-draws">Nenhum item sorteado ainda</p>';
        updateRestoreButtonVisibility();
        return;
    }
    
    drawnItems.forEach((drawn, index) => {
        const drawnDiv = document.createElement('div');
        drawnDiv.className = 'drawn-item';
        drawnDiv.innerHTML = `
            <span>🏆 ${drawn.item}</span>
            <span class="drawn-time">${drawn.time}</span>
        `;
        drawnItemsContainer.appendChild(drawnDiv);
    });
    
    updateRestoreButtonVisibility();
}

function clearDrawnItems() {
    drawnItems = [];
    updateDrawnItems();
    updateRestoreButtonVisibility();
}

function updateRestoreButtonVisibility() {
    if (removeAfterDrawCheckbox.checked && drawnItems.length > 0) {
        restoreBtn.style.display = 'inline-block';
    } else {
        restoreBtn.style.display = 'none';
    }
}

function restoreDrawnItems() {
    if (drawnItems.length === 0) return;
    
    const itemsToRestore = drawnItems.map(drawn => drawn.item);
    
    itemsToRestore.forEach(item => {
        if (!items.includes(item)) {
            items.push(item);
        }
    });
    
    drawnItems = [];
    lastWinnerToRemove = null;
    
    updateWheel();
    updateItemsList();
    updateDrawnItems();
    updateRestoreButtonVisibility();
    
    restoreBtn.classList.add('animate');
    setTimeout(() => {
        restoreBtn.classList.remove('animate');
    }, 500);
    
    result.innerHTML = '🔄 Itens restaurados na roleta!';
    result.style.display = 'block';
    setTimeout(() => {
        result.style.display = 'none';
    }, 2000);
}

function addToDrawnItems(item) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    drawnItems.unshift({
        item: item,
        time: timeString,
        date: now
    });
    
    if (drawnItems.length > 20) {
        drawnItems = drawnItems.slice(0, 20);
    }
    
    updateDrawnItems();
}

function spin() {
    if (isSpinning || items.length === 0) return;
    
    if (removeAfterDrawCheckbox.checked && lastWinnerToRemove) {
        const indexToRemove = items.indexOf(lastWinnerToRemove);
        if (indexToRemove > -1) {
            items.splice(indexToRemove, 1);
            updateWheel();
            updateItemsList();
        }
        lastWinnerToRemove = null;
        
        if (items.length === 0) {
            result.innerHTML = '🎯 Todos os itens foram sorteados!<br><small>Adicione novos itens para continuar</small>';
            result.style.display = 'block';
            return;
        }
    }
    
    isSpinning = true;
    spinBtn.disabled = true;
    result.style.display = 'none';
    
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';
    
    wheel.offsetHeight;
    
    const spins = Math.floor(Math.random() * 5) + 5;
    const finalAngle = Math.floor(Math.random() * 360);
    const totalRotation = spins * 360 + finalAngle;
    
    setTimeout(() => {
        wheel.style.transition = 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)';
        wheel.style.transform = `rotate(${totalRotation}deg)`;
    }, 10);
    
    const segmentAngle = 360 / items.length;
    const normalizedAngle = (360 - (finalAngle % 360)) % 360;
    const winningIndex = Math.floor(normalizedAngle / segmentAngle);
    const winner = items[winningIndex];
    
    setTimeout(() => {
        result.textContent = `🎉 Resultado: ${winner} 🎉`;
        result.style.display = 'block';
        
        addToDrawnItems(winner);
        
        if (removeAfterDrawCheckbox.checked) {
            lastWinnerToRemove = winner;
        }
        
        isSpinning = false;
        spinBtn.disabled = false;
    }, 4000);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Botões principais
    spinBtn.addEventListener('click', spin);
    addBtn.addEventListener('click', addItem);
    
    // Input com Enter
    itemInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addItem();
    });

    // Checkbox
    removeAfterDrawCheckbox.addEventListener('change', updateRestoreButtonVisibility);

    // Botões de preset
    document.getElementById('numbersBtn').addEventListener('click', () => loadPreset('numbers'));
    document.getElementById('peopleBtn').addEventListener('click', () => loadPreset('people'));
    document.getElementById('foodBtn').addEventListener('click', () => loadPreset('food'));
    document.getElementById('activitiesBtn').addEventListener('click', () => loadPreset('activities'));
    
    // Botão nova lista
    document.getElementById('clearBtn').addEventListener('click', clearList);
    
    // Botões do histórico
    document.getElementById('clearHistoryBtn').addEventListener('click', clearDrawnItems);
    restoreBtn.addEventListener('click', restoreDrawnItems);

    // Event delegation para botões de remover itens
    itemsList.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-btn')) {
            const index = parseInt(e.target.getAttribute('data-index'));
            removeItem(index);
        }
    });

    // Inicializar
    updateWheel();
    updateItemsList();
    updateDrawnItems();
    updateRestoreButtonVisibility();
});