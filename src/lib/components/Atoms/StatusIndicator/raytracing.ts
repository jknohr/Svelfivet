type Ray = {
  startX: number;
  startY: number;
  angle: number;
  intensity: number;
  color: string;
};

type GridCell = {
  x: number;
  y: number;
  opacity: number;
  elevation: number;
};

export function calculateRayPaths(
  rays: Ray[],
  gridCells: GridCell[],
  gridSize: { columns: number; rows: number }
) {
  const paths: string[] = [];
  const shadows: string[] = [];
  
  rays.forEach(ray => {
    let currentX = ray.startX;
    let currentY = ray.startY;
    let currentIntensity = ray.intensity;
    
    const path = [`M ${currentX} ${currentY}`];
    const shadowPath = [];
    
    // Trace ray through grid
    while (
      currentX >= 0 && 
      currentX <= gridSize.columns && 
      currentY >= 0 && 
      currentY <= gridSize.rows && 
      currentIntensity > 0.05
    ) {
      const nextX = currentX + Math.cos(ray.angle);
      const nextY = currentY + Math.sin(ray.angle);
      
      // Find intersecting cells
      const cell = gridCells.find(c => 
        c.x <= nextX && 
        c.x + 1 >= nextX && 
        c.y <= nextY && 
        c.y + 1 >= nextY
      );
      
      if (cell) {
        // Calculate reflection and refraction
        currentIntensity *= (1 - cell.opacity);
        
        // Create shadow based on elevation
        if (cell.elevation > 0) {
          shadowPath.push(`
            M ${currentX} ${currentY}
            L ${nextX + cell.elevation * Math.cos(ray.angle + Math.PI/2)} 
              ${nextY + cell.elevation * Math.sin(ray.angle + Math.PI/2)}
          `);
        }
      }
      
      path.push(`L ${nextX} ${nextY}`);
      currentX = nextX;
      currentY = nextY;
    }
    
    paths.push(path.join(' '));
    if (shadowPath.length) {
      shadows.push(shadowPath.join(' '));
    }
  });
  
  return { paths, shadows };
}