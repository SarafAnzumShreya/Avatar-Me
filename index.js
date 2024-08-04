const canvas = document.getElementById('avatar-canvas');
const body1 = document.getElementById('body1');
const ctx = canvas.getContext('2d');

function loadImage(src, callback) {
    const img = new Image();
    img.onload = callback;
    img.src = src;
}

function drawAvatar(src) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    loadImage(src, function() {
        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
    });
}

body1.addEventListener('click',function(){
 var img = body1.src;
 drawAvatar(img);
});

function saveAvatar() {
    const link = document.createElement('a');
    link.download = 'avatar.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
}

window.onload = drawAvatar;



