import fontColorContrast from "font-color-contrast";

export const getColorForLetter = (letter: string): { bgColor: string; textFont: string } => {
    const colorMap: { [key: string]: string } = {
        A: "#FF6633", B: "#FFB399", C: "#FF33FF", D: "#FFFF99", E: "#00B3E6",
        F: "#E6B333", G: "#3366E6", H: "#999966", I: "#99FF99", J: "#B34D4D",
        K: "#80B300", L: "#809900", M: "#E6B3B3", N: "#6680B3", O: "#66991A",
        P: "#FF99E6", Q: "#CCFF1A", R: "#FF1A66", S: "#E6331A", T: "#33FFCC",
        U: "#66994D", V: "#B366CC", W: "#4D8000", X: "#B33300", Y: "#CC80CC",
        Z: "#66664D"
    };

    const upperLetter = letter.toUpperCase();
    const bgColor = colorMap[upperLetter] || "#000000"; // Fallback to black
    const textFont = fontColorContrast(bgColor);

    return { bgColor, textFont };
};