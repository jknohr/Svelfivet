/**
 * Calculates the minimum width and height required to fit the content of an element
 */
export function calculateFitContentWidth(element: HTMLElement): [number, number] {
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = 'absolute';
    clone.style.visibility = 'hidden';
    clone.style.width = 'auto';
    clone.style.height = 'auto';
    document.body.appendChild(clone);

    const width = clone.offsetWidth;
    const height = clone.offsetHeight;

    document.body.removeChild(clone);
    return [width, height];
} 