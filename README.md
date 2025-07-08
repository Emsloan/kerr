# Kerr Black Hole Orbit Simulator

This simple browser-based simulation visualizes an object orbiting a rotating black hole.
It allows adjustment of:

- **Black hole mass** and **spin**
- **Orbit radius** of the orbiting body
- **Density** of the orbiting body

The interface now also shows the **gravitational** and **orbital velocity** time
dilation factors. These values are summed to give the **total time dilation**
experienced by the orbiting body compared to a distant observer.

The page shows whether the object is inside or outside the Roche limit based on the
selected parameters. The Roche limit now decreases with black hole spin to approximate
the effect of spacetime waves for a prograde orbit.

Open `index.html` in a modern browser to try it out. The black hole mass slider
now allows values up to 1e36 kg to represent supermassive black holes. The
orbit radius slider reaches up to 1e10 m and the canvas displays both the Roche
limit (red dashed circle) and the orbital path, automatically scaling the view
so the features remain visible.
