let canvas = document.getElementById('mesh');
//genrate random circles on canvas
let ctx = canvas.getContext('2d');
ctx.globalAlpha = 0.5;

let circles = [];
const circleCount = 150;


const radius = 3;
const color = '#fff';
const speed = 0.3;
const scale = 0.03;



for (let i = 0; i < circleCount; i++) {
    let circle = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        directionX: Math.random(),
        directionY: Math.random(),
        trail: [{
            x: this.x,
            y: this.y
        }],
        circleColor: `hsl(${Math.random() * 360}, 100%, 50%)`

    };
    circles.push(circle);
}

//draw circles
/*
function drawCircles() {
    for (let i = 0; i < circles.length; i++) {
        let circle = circles[i];
        ctx.beginPath();
        ctx.arc(circle.x, circle.y,radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = circle.alpha;
        ctx.fill();
        ctx.closePath();
    }
}
*/
function drawCircles() {
    for (let i = 0; i < circles.length; i++) {
        let circle = circles[i];
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = circle.alpha;
        ctx.fill();
        ctx.closePath();

        // Draw circle's trail
        ctx.beginPath();
        ctx.moveTo(circle.trail[0].x, circle.trail[0].y);
        for (let j = 1; j < circle.trail.length; j++) {
            let prevPos = circle.trail[j - 1];
            let currPos = circle.trail[j];
            ctx.lineTo(currPos.x, currPos.y);
        }
        ctx.strokeStyle = circle.circleColor;
        ctx.stroke();
        ctx.closePath();
    }
}
drawCircles();

//go over each circle and conncting a line beetween them
function connectCircles() {
    for (let i = 0; i < circles.length; i++) {
        let circle = circles[i];
        for (let j = i + 1; j < circles.length; j++) {
            let otherCircle = circles[j];
            let dx = otherCircle.x - circle.x;
            let dy = otherCircle.y - circle.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let threshold = 100;

            if (distance < threshold) {
                // calculate gravitational force
                let force = (threshold - distance) / threshold;
                let forceX = force * dx / distance * scale;
                let forceY = force * dy / distance * scale;

                // apply gravitational force to circles
                circle.directionX += forceX;
                circle.directionY += forceY;
                otherCircle.directionX -= forceX;
                otherCircle.directionY -= forceY;
            }

            // draw connecting lines
            ctx.beginPath();
            ctx.moveTo(circle.x, circle.y);
            ctx.lineTo(otherCircle.x, otherCircle.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${(threshold - distance) / threshold})`;
            ctx.stroke();
            ctx.closePath();
        }
    }
}






connectCircles();

//move circles
/*
function moveCircles() {
    for (let i = 0; i < circles.length; i++) {
        let circle = circles[i];
        circle.y += speed * circle.directionY;
        circle.x += speed * circle.directionX;
        if (circle.x + radius > canvas.width || circle.x - radius < 0) {
            circle.directionX *= -1;
        }
        if (circle.y + radius > canvas.height || circle.y - radius < 0) {
            circle.directionY *= -1;
        }
    }
}
moveCircles();
*/

function moveCircles() {
    for (let i = 0; i < circles.length; i++) {
        let circle = circles[i];
        circle.x += speed * circle.directionX;
        circle.y += speed * circle.directionY;

        // Add previous position to circle's trail
        circle.trail.push({ x: circle.x, y: circle.y });
        if (circle.trail.length > 60) {
            // Remove oldest position from trail
            circle.trail.shift();
        }

        if (circle.x + radius > canvas.width || circle.x - radius < 0) {
            circle.directionX *= -1;
        }
        if (circle.y + radius > canvas.height || circle.y - radius < 0) {
            circle.directionY *= -1;
        }
    }
}

//animate 
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCircles();
    connectCircles();
    moveCircles();
    requestAnimationFrame(animate);
} 


animate();