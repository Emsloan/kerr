const G = 6.67430e-11;
const c = 299792458;

const bhMassSlider = document.getElementById('bhMass');
const bhSpinSlider = document.getElementById('bhSpin');
const orbitRadiusSlider = document.getElementById('orbitRadius');
const objDensitySlider = document.getElementById('objDensity');

const bhMassVal = document.getElementById('bhMassVal');
const bhSpinVal = document.getElementById('bhSpinVal');
const orbitRadiusVal = document.getElementById('orbitRadiusVal');
const objDensityVal = document.getElementById('objDensityVal');

const rocheStatus = document.getElementById('rocheStatus');
const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

let angle = 0;

function updateLabels() {
  bhMassVal.textContent = bhMassSlider.value;
  bhSpinVal.textContent = bhSpinSlider.value;
  orbitRadiusVal.textContent = orbitRadiusSlider.value;
  objDensityVal.textContent = objDensitySlider.value;
}

function schwarzschildRadius(mass) {
  return 2 * G * mass / (c * c);
}

function blackHoleDensity(mass) {
  const r = schwarzschildRadius(mass);
  const volume = (4 / 3) * Math.PI * Math.pow(r, 3);
  return mass / volume;
}

function rocheLimit(mass, objDensity) {
  const r = schwarzschildRadius(mass);
  const bhDensity = blackHoleDensity(mass);
  return 2.44 * r * Math.pow(bhDensity / objDensity, 1/3);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const mass = parseFloat(bhMassSlider.value);
  const spin = parseFloat(bhSpinSlider.value); // not used in calc
  const orbitRadius = parseFloat(orbitRadiusSlider.value);
  const density = parseFloat(objDensitySlider.value);

  const rSch = schwarzschildRadius(mass);
  const rLimit = rocheLimit(mass, density);

  // map distance to canvas coordinates
  const scale = 100 / rSch; // 100 px per Schwarzschild radius
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // draw black hole (scaled by spin slightly)
  const bhRadius = rSch * scale * (1 + spin * 0.5);
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(centerX, centerY, bhRadius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = '#444';
  ctx.stroke();

  angle += 0.01;
  const objX = centerX + Math.cos(angle) * orbitRadius * scale;
  const objY = centerY + Math.sin(angle) * orbitRadius * scale;

  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(objX, objY, 5, 0, 2 * Math.PI);
  ctx.fill();

  // Roche limit indicator
  rocheStatus.textContent = orbitRadius < rLimit ?
    'Inside Roche Limit' : 'Outside Roche Limit';
  rocheStatus.style.color = orbitRadius < rLimit ? 'red' : 'lightgreen';

  requestAnimationFrame(draw);
}

bhMassSlider.addEventListener('input', updateLabels);
bhSpinSlider.addEventListener('input', updateLabels);
orbitRadiusSlider.addEventListener('input', updateLabels);
objDensitySlider.addEventListener('input', updateLabels);

updateLabels();
requestAnimationFrame(draw);
