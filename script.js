let items = ['Pizza', 'Hambúrguer', 'Sushi', 'Tacos', 'Sorvete', 'Salada'];
let drawnItems = [];
let isSpinning = false;

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
    colors: ['Vermelho', 'Azul', 'Verde', 'Amarelo', 'Roxo', 'Rosa'],
    food: ['Pizza', 'Hambúrguer', 'Sushi', 'Tacos', 'Sorvete', 'Salada', 'Pasta', 'Frango'],
    activities: ['Cinema', 'Parque', 'Praia', 'Shopping', 'Restaurante', 'Casa', 'Esportes', 'Leitura']
};

function updateWheel() {
    wheel.innerHTML = '';
    
    if (items.length === 0) {
        // Mostrar mensagem quando não há itens
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
    
    // Caso especial: apenas 1 item - criar círculo completo
    if (items.length === 1) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 400 400');
        svg.style.position = 'absolute';
        svg.style.top = '0';
        svg.style.left = '0';
        
        // Criar filtro para sombra do texto
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        filter.setAttribute('id', 'textShadow');
        filter.setAttribute('x', '-20%');
        filter.setAttribute('y', '-20%');
        filter.setAttribute('width', '140%');
        filter.setAttribute('height', '140%');
        
        const feDropShadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
        feDropShadow.setAttribute('dx', '1');
        feDropShadow.setAttribute('dy', '1');
        feDropShadow.setAttribute('stdDeviation', '2');
        feDropShadow.setAttribute('flood-color', 'rgba(0,0,0,0.5)');
        
        filter.appendChild(feDropShadow);
        defs.appendChild(filter);
        svg.appendChild(defs);
        
        // Criar círculo completo
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '200');
        circle.setAttribute('cy', '200');
        circle.setAttribute('r', '190');
        circle.setAttribute('fill', colors[0]);
        circle.setAttribute('stroke', 'rgba(255, 255, 255, 0.3)');
        circle.setAttribute('stroke-width', '2');
        
        svg.appendChild(circle);
        
        // Adicionar texto centralizado
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', '200');
        text.setAttribute('y', '200');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('fill', 'white');
        text.setAttribute('font-family', 'Arial, sans-serif');
        text.setAttribute('font-weight', 'bold');
        text.setAttribute('font-size', '24px');
        text.setAttribute('filter', 'url(#textShadow)');
        text.textContent = items[0];
        
        svg.appendChild(text);
        wheel.appendChild(svg);
        return;
    }

    // Múltiplos itens - criar segmentos
    const anglePerSegment = 360 / items.length;
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 400 400');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    
    // Criar filtro para sombra do texto (usado em todos os casos)
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'textShadow');
    filter.setAttribute('x', '-20%');
    filter.setAttribute('y', '-20%');
    filter.setAttribute('width', '140%');
    filter.setAttribute('height', '140%');
    
    const feDropShadow = document.createElementNS('http://www.w3.org/2000/svg', 'feDropShadow');
    feDropShadow.setAttribute('dx', '1');
    feDropShadow.setAttribute('dy', '1');
    feDropShadow.setAttribute('stdDeviation', '2');
    feDropShadow.setAttribute('flood-color', 'rgba(0,0,0,0.5)');
    
    filter.appendChild(feDropShadow);
    defs.appendChild(filter);
    svg.appendChild(defs);
    
    const centerX = 200;
    const centerY = 200;
    const radius = 190;
    
    items.forEach((item, index) => {
        const startAngle = (index * anglePerSegment - 90) * (Math.PI / 180);
        const endAngle = ((index + 1) * anglePerSegment - 90) * (Math.PI / 180);
        
        // Calcular pontos do arco
        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);
        
        const largeArc = anglePerSegment > 180 ? 1 : 0;
        
        // Criar path do segmento
        const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
            'Z'
        ].join(' ');
        
        // Criar elemento path
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('fill', colors[index % colors.length]);
        path.setAttribute('stroke', 'rgba(255, 255, 255, 0.3)');
        path.setAttribute('stroke-width', '2');
        
        svg.appendChild(path);
        
        // Adicionar texto
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
        text.setAttribute('filter', 'url(#textShadow)');
        
        // Ajustar tamanho da fonte baseado no número de itens
        let fontSize;
        if (items.length <= 6) {
            fontSize = '18px';
        } else if (items.length <= 10) {
            fontSize = '16px';
        } else {
            fontSize = '14px';
        }
        text.setAttribute('font-size', fontSize);
        
        // Rotacionar texto se necessário
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
            <button class="remove-btn" onclick="removeItem(${index})">Remover</button>
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
    drawnItems = []; // Limpar histórico ao carregar preset
    updateWheel();
    updateItemsList();
    updateDrawnItems();
    result.style.display = 'none'; // Esconder resultado anterior
}

function clearList() {
    items = [];
    drawnItems = []; // Limpar histórico ao criar nova lista
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
    // Mostrar botão apenas se checkbox estiver marcado e houver itens sorteados
    if (removeAfterDrawCheckbox.checked && drawnItems.length > 0) {
        restoreBtn.style.display = 'inline-block';
    } else {
        restoreBtn.style.display = 'none';
    }
}

function restoreDrawnItems() {
    if (drawnItems.length === 0) return;
    
    // Adicionar todos os itens sorteados de volta à roda
    const itemsToRestore = drawnItems.map(drawn => drawn.item);
    
    // Evitar duplicatas - adicionar apenas itens que não estão na roleta
    itemsToRestore.forEach(item => {
        if (!items.includes(item)) {
            items.push(item);
        }
    });
    
    // Limpar histórico após restaurar
    drawnItems = [];
    
    // Atualizar tudo
    updateWheel();
    updateItemsList();
    updateDrawnItems();
    updateRestoreButtonVisibility();
    
    // Animação no botão
    restoreBtn.classList.add('animate');
    setTimeout(() => {
        restoreBtn.classList.remove('animate');
    }, 500);
    
    // Mostrar feedback visual
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
    
    // Manter apenas os últimos 20 itens
    if (drawnItems.length > 20) {
        drawnItems = drawnItems.slice(0, 20);
    }
    
    updateDrawnItems();
}

function spin() {
    if (isSpinning || items.length === 0) return;
    
    isSpinning = true;
    spinBtn.disabled = true;
    result.style.display = 'none';
    
    // Resetar a rotação antes de girar
    wheel.style.transition = 'none';
    wheel.style.transform = 'rotate(0deg)';
    
    // Forçar o reflow para aplicar o reset
    wheel.offsetHeight;
    
    // Calcular rotação
    const spins = Math.floor(Math.random() * 5) + 5; // 5-9 voltas completas
    const finalAngle = Math.floor(Math.random() * 360);
    const totalRotation = spins * 360 + finalAngle;
    
    // Aplicar a animação
    setTimeout(() => {
        wheel.style.transition = 'transform 4s cubic-bezier(0.25, 0.1, 0.25, 1)';
        wheel.style.transform = `rotate(${totalRotation}deg)`;
    }, 10);
    
    // Calcular resultado
    const segmentAngle = 360 / items.length;
    const normalizedAngle = (360 - (finalAngle % 360)) % 360;
    const winningIndex = Math.floor(normalizedAngle / segmentAngle);
    const winner = items[winningIndex];
    
    // Mostrar resultado após a animação
    setTimeout(() => {
        result.textContent = `🎉 Resultado: ${winner} 🎉`;
        result.style.display = 'block';
        
        // Adicionar ao histórico de sorteados
        addToDrawnItems(winner);
        
        // Remover item se checkbox estiver marcado
        if (removeAfterDrawCheckbox.checked) {
            const winnerIndex = items.indexOf(winner);
            if (winnerIndex > -1) {
                items.splice(winnerIndex, 1);
                updateWheel();
                updateItemsList();
                
                // Verificar se ainda há itens para sortear
                if (items.length === 0) {
                    setTimeout(() => {
                        result.innerHTML = `🎉 ${winner} 🎉<br><small>Todos os itens foram sorteados!</small>`;
                    }, 500);
                }
            }
        }
        
        isSpinning = false;
        spinBtn.disabled = false;
    }, 4000);
}

// Event listeners
spinBtn.addEventListener('click', spin);
addBtn.addEventListener('click', addItem);
itemInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addItem();
});

// Atualizar visibilidade do botão restaurar quando checkbox mudar
removeAfterDrawCheckbox.addEventListener('change', updateRestoreButtonVisibility);

// Inicializar
updateWheel();
updateItemsList();
updateDrawnItems();
updateRestoreButtonVisibility();