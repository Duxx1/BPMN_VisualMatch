export function calcularSimilitudCasillas(matriz) {
    // Inicializamos la estructura de datos donde almacenaremos los resultados
    let resultados = [];
    
    // Recorremos la matriz y comparamos cada casilla con las demás
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[0].length; j++) {
            let similitud = 0;
            let sumaXY = 0;
            let sumaX = 0;
            let sumaY = 0;
            let sumaX2 = 0;
            let sumaY2 = 0;
            let n = 0;
            for (let k = 0; k < matriz.length; k++) {
                for (let l = 0; l < matriz[0].length; l++) {
                    // Utilizamos la correlación de Pearson como medida de similitud
                    sumaXY += matriz[i][j] * matriz[k][l];
                    sumaX += matriz[i][j];
                    sumaY += matriz[k][l];
                    sumaX2 += matriz[i][j]**2;
                    sumaY2 += matriz[k][l]**2;
                    n += 1;
                }
            }
            let covXY = sumaXY - (sumaX * sumaY) / n;
            let varX = sumaX2 - (sumaX**2) / n;
            let varY = sumaY2 - (sumaY**2) / n;
            if (varX === 0 || varY === 0) {
                // Si alguna de las variables tiene varianza 0, asignamos el valor 100 o 0 según corresponda
                similitud = matriz[i][j] === matriz[0][0] ? 100 : 0;
            } else {
                similitud = covXY / (Math.sqrt(varX) * Math.sqrt(varY));
                // Convertimos el resultado a un valor entre 0 y 100
                similitud = (similitud + 1) * 50;
            }
            // Almacenamos el resultado de la comparación en la estructura de datos
            resultados.push([i, j, similitud]);
        }
    }
    
    return resultados;
}



export function calcularSimilitudCasillas2(matriz) {
    // Inicializamos la estructura de datos donde almacenaremos los resultados
    let resultados = [];
    
    // Recorremos la matriz y comparamos cada casilla con las demás
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[0].length; j++) {
            let similitud = 0;
            for (let k = 0; k < matriz.length; k++) {
                for (let l = 0; l < matriz[0].length; l++) {
                    // Utilizamos la distancia Euclidiana como medida de similitud
                    similitud += Math.pow(matriz[i][j] - matriz[k][l], 2);
                }
            }
            similitud = Math.sqrt(similitud);
            // Almacenamos el resultado de la comparación en la estructura de datos
            resultados.push([i, j, similitud]);
        }
    }
    
    return resultados;
}
