// script.js

// Set up canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Particle properties
const NUM_CELLS = 100;
const cells = [];
const BASE_REPULSION = 500; // Reduced base repulsion to control the overall force
const FORCE_SCALING = 0.01; // Scale down forces to make them weaker
const DRAG = 0.98; // Add drag to reduce the velocity over time

// Create cell objects
class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = Math.random() * 2 - 1;  // Random velocity in x direction
        this.vy = Math.random() * 2 - 1;  // Random velocity in y direction
        this.size = 5;                    // Cell size
        this.attractForce = Math.random() * 0.01 - 0.005; // Reduced attraction/repulsion force
    }

    // Update cell position and apply forces
    update(cells) {
        let fx = 0;
        let fy = 0;

        // Loop through all other cells and calculate forces
        for (let other of cells) {
            if (other !== this) {
                const dx = other.x - this.x;
                const dy = other.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist > 0 && dist < 150) {  // Only apply forces if within a certain range
                    const force = ((this.attractForce + BASE_REPULSION / dist) / dist) * FORCE_SCALING;
                    fx += force * dx;
                    fy += force * dy;
                }
            }
        }

        // Apply forces to velocity
        this.vx += fx;
        this.vy += fy;

        // Apply drag to slow down velocities
        this.vx *= DRAG;
        this.vy *= DRAG;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Keep the cells inside the canvas
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    // Draw the cell
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#00ff00';
        ctx.fill();
        ctx.closePath();
    }
}

// Initialize cells
for (let i = 0; i < NUM_CELLS; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    cells.push(new Cell(x, y));
}

// Update and render loop
function animate() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw each cell
    for (let cell of cells) {
        cell.update(cells);
        cell.draw();
    }

    // Call the next frame
    requestAnimationFrame(animate);
}

// Start the animation
animate();
