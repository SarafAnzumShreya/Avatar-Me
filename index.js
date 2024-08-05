const canvas = document.getElementById('avatar-canvas');
const ctx = canvas.getContext('2d');

let selectedItems = {
    background: null,
    body: null,    
    makeup: null,
    eyebrow: null,
    dress: null,
    hair: null,
    headcover: null,
    beard: null,
    accessory: null,
    jewelry: null,    
    hijab: null
};

const colorOptions = {
    body: ['#f9cfba', '#e6ac8f', '#be8467', '#71432c'],
    hair: ['#000000', '#6b1505', '#7e4600', '#e0b37b'],
    eyebrow: ['#000000', '#6b1505', '#e0b37b'],
    hijab: ['#000000', '#6b1505', '#7e4600', '#e0b37b'],
    headcover: ['#000000', '#6b1505', '#7e4600', '#e0b37b'],
    beard: ['#000000', '#7e4600', '#6b1505']
};

const excludedFeatures = ['hijab', 'headcover', 'makeup', 'beard'];

function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
    });
}

async function drawAvatar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background first
    const backgroundImage = selectedItems.background ? await loadImage(selectedItems.background.src) : null;
    if (backgroundImage) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    // Draw body on top of background
    const bodyImage = selectedItems.body ? await loadImage(selectedItems.body.src) : null;
    if (bodyImage) {
        ctx.drawImage(bodyImage, 0, 0, canvas.width, canvas.height);
    }

    // Draw other features
    const features = Object.keys(selectedItems).filter(key => key !== 'body' && key !== 'background' && selectedItems[key]);
    for (const feature of features) {
        const img = await loadImage(selectedItems[feature].src);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

function selectFeature(feature) {
    document.querySelectorAll('.item-group').forEach(group => {
        group.classList.remove('active');
    });
    document.getElementById(feature).classList.add('active');
    showColorOptions(feature);
}

function selectItem(feature, item) {
    if (item.classList.contains('none')) {
        // Remove the feature if 'none' is selected
        if (selectedItems[feature]) {
            selectedItems[feature].classList.remove('selected');
        }
        selectedItems[feature] = null;
    } else {
        // Select the feature
        if (selectedItems[feature]) {
            selectedItems[feature].classList.remove('selected');
        }
        item.classList.add('selected');
        selectedItems[feature] = item;
    }
    drawAvatar();
}

document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', function() {
        const feature = this.parentElement.id;
        selectItem(feature, this);
    });
});

function removeItem(feature) {
    if (selectedItems[feature]) {
        selectedItems[feature].classList.remove('selected');
        selectedItems[feature] = null;
    }
    drawAvatar();
}

function saveAvatar() {
    const link = document.createElement('a');
    link.download = 'avatar.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function showColorOptions(feature) {
    const colorOptionsDiv = document.getElementById('color-options');
    colorOptionsDiv.innerHTML = '';
    if (colorOptions[feature]) {
        colorOptions[feature].forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'color';
            colorDiv.style.backgroundColor = color;
            colorDiv.addEventListener('click', function() {
                changeColor(feature, color);
            });
            colorOptionsDiv.appendChild(colorDiv);
        });
    }
}

function changeColor(feature, color) {
    const selectedItem = selectedItems[feature];
    if (selectedItem) {
        const src = selectedItem.src.split('/');
        src[src.length - 1] = `${color.replace('#', '')}.png`;
        selectedItem.src = src.join('/');
        drawAvatar();
    }
}

function getRandomItem(group) {
    if (excludedFeatures.includes(group)) {
        return;
    }
    const items = document.querySelectorAll(`#${group} .item:not(.none)`);
    const randomItem = items[Math.floor(Math.random() * items.length)];
    selectItem(group, randomItem);
}

window.onload = () => {
    selectFeature('body');
    Object.keys(selectedItems).forEach(feature => {
        getRandomItem(feature);
    });

};
