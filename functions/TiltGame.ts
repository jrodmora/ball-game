export const calculateBallSize = (toggleSizeBig: boolean, width: number) => {
    if (!toggleSizeBig)
        return width * 0.3
    else
        return width * 0.1
}

export const calculateX = (x: number, width: number) => {
    return Math.min(Math.max(x, 0), width - 50)
}

export const calculateY = (y: number, height: number) => {
    return Math.min(Math.max(y, 0), height - 50)
}