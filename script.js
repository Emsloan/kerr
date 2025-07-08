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
const timeDilationVal = document.getElementById('timeDilation');
const gravDilVal = document.getElementById('gravDil');
const velDilVal = document.getElementById('velDil');

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

function rocheLimit(mass, objDensity, spin) {
  const r = schwarzschildRadius(mass);
  const bhDensity = blackHoleDensity(mass);
  let baseLimit = 2.44 * r * Math.pow(bhDensity / objDensity, 1/3);
  // simplified prograde adjustment: higher spin reduces the limit
  return baseLimit / (1 + spin);
}

function gravitationalTimeDilation(mass, radius) {
  const rSch = schwarzschildRadius(mass);
  const factor = Math.sqrt(1 - rSch / radius);
  if (isNaN(factor) || factor < 0) {
    return 0;
  }
  return factor;
}

function orbitalVelocityTimeDilation(mass, radius) {
  const v = Math.sqrt((G * mass) / radius);
  const factor = Math.sqrt(1 - (v * v) / (c * c));
  if (isNaN(factor) || factor < 0) {
    return 0;
  }
  return factor;
}

function totalTimeDilation(mass, radius) {
  const gDil = gravitationalTimeDilation(mass, radius);
  const vDil = orbitalVelocityTimeDilation(mass, radius);
  return gDil + vDil;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const mass = parseFloat(bhMassSlider.value);
  const spin = parseFloat(bhSpinSlider.value);
  const orbitRadius = parseFloat(orbitRadiusSlider.value);
  const density = parseFloat(objDensitySlider.value);

  const rSch = schwarzschildRadius(mass);
  const rLimit = rocheLimit(mass, density, spin);

  // choose a scale so the largest distance fits on the canvas
  const maxDist = Math.max(orbitRadius, rLimit) * 1.1;
  const scale = (canvas.width / 2 - 20) / maxDist;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // draw orbit path
  ctx.strokeStyle = '#555';
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.arc(centerX, centerY, orbitRadius * scale, 0, 2 * Math.PI);
  ctx.stroke();

  // draw Roche limit circle
  ctx.strokeStyle = 'red';
  ctx.beginPath();
  ctx.arc(centerX, centerY, rLimit * scale, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.setLineDash([]);

  // draw black hole (ensure minimum visible radius)
  const bhRadius = Math.max(2, rSch * scale * (1 + spin * 0.5));
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(centerX, centerY, bhRadius, 0, 2 * Math.PI);
  ctx.fill();
  ctx.strokeStyle = '#aaa';
  ctx.stroke();

  // position of orbiting object
  angle += 0.01;
  const objX = centerX + Math.cos(angle) * orbitRadius * scale;
  const objY = centerY + Math.sin(angle) * orbitRadius * scale;

  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(objX, objY, 5, 0, 2 * Math.PI);
  ctx.fill();

  // Roche limit indicator
  rocheStatus.textContent = `${orbitRadius < rLimit ? 'Inside' : 'Outside'} Roche Limit (limit ≈ ${rLimit.toExponential(2)} m)`;
  rocheStatus.style.color = orbitRadius < rLimit ? 'red' : 'lightgreen';

  // time dilation display
  const gDil = gravitationalTimeDilation(mass, orbitRadius);
  const vDil = orbitalVelocityTimeDilation(mass, orbitRadius);
  const totalDil = totalTimeDilation(mass, orbitRadius);
  gravDilVal.textContent = gDil.toFixed(3);
  velDilVal.textContent = vDil.toFixed(3);
  timeDilationVal.textContent = totalDil.toFixed(3);

  requestAnimationFrame(draw);
}

bhMassSlider.addEventListener('input', updateLabels);
bhSpinSlider.addEventListener('input', updateLabels);
orbitRadiusSlider.addEventListener('input', updateLabels);
objDensitySlider.addEventListener('input', updateLabels);

updateLabels();
requestAnimationFrame(draw);
