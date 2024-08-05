const canvas = document.getElementById('avatar-canvas');
const ctx = canvas.getContext('2d');

let selectedItems = {
    body: null,
    hair: null,
    hijab: null,
    eyebrow: null,
    beard: null,
    dress: null,
    accessory: null,
    jewelry: null,
    makeup: null,
    background: null
};

function loadImage(src, callback) {
    const img = new Image();
    img.onload = callback;
    img.src = src;
}

function drawAvatar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Object.values(selectedItems).forEach(item => {
        if (item) {
            loadImage(item.src, function() {
                ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
            });
        }
    });
}

function selectFeature(feature) {
    document.querySelectorAll('.item-group').forEach(group => {
        group.classList.remove('active');
    });
    document.getElementById(feature).classList.add('active');
}

function selectItem(feature, item) {
    if (selectedItems[feature]) {
        selectedItems[feature].classList.remove('selected');
    }
    item.classList.add('selected');
    selectedItems[feature] = item;
    showColorOptions(feature);
    drawAvatar();
}

document.querySelectorAll('.item').forEach(item => {
    item.addEventListener('click', function() {
        const feature = this.parentElement.id;
        selectItem(feature, this);
    });
});

function saveAvatar() {
    const link = document.createElement('a');
    link.download = 'avatar.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

function showColorOptions(feature) {
    const colorOptions = document.getElementById('color-options');
    colorOptions.innerHTML = '';
    if (['hair', 'eyebrow', 'beard'].includes(feature)) {
        const colors = ['#000000', '#4B0082', '#FF4500', '#FFD700'];
        colors.forEach(color => {
            const colorDiv = document.createElement('div');
            colorDiv.className = 'color';
            colorDiv.style.backgroundColor = color;
            colorDiv.addEventListener('click', function() {
                changeColor(feature, color);
            });
            colorOptions.appendChild(colorDiv);
        });
    }
}

function changeColor(feature, color) {
    const selectedItem = selectedItems[feature];
    if (selectedItem) {
        const src = selectedItem.src.split('/');
        src[src.length - 1] = `color_${color.replace('#', '')}.png`;
        selectedItem.src = src.join('/');
        drawAvatar();
    }
}

window.onload = () => {
    selectFeature('body');
};
