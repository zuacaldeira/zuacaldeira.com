// Every element inside `selector` (itself included) that holds text of its own, with its contrast
// against what is painted behind it: the first background up its ancestors, half-transparent ones
// laid over the next. A canvas turns any CSS colour (color-mix, oklab) into sRGB. Shared by the
// footer (SHELL-07), the Software band (SW-PROOF-05) and the Writing list (WR-LIST-14).
export const contrastsIn = (page, selector) =>
  page.evaluate((selector) => {
    const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    const rgba = (css) => {
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = css;
      ctx.fillRect(0, 0, 1, 1);
      const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
      return [r, g, b, a / 255];
    };
    const over = ([r, g, b, a], [R, G, B]) => [
      r * a + R * (1 - a),
      g * a + G * (1 - a),
      b * a + B * (1 - a),
      1,
    ];
    const background = (el) => {
      const layers = [];
      for (let e = el; e; e = e.parentElement) {
        const c = rgba(getComputedStyle(e).backgroundColor);
        if (c[3] > 0) layers.push(c);
        if (c[3] === 1) break;
      }
      return layers.reduceRight((below, layer) => over(layer, below), [255, 255, 255, 1]);
    };
    const luminance = (c) => {
      const [r, g, b] = c.slice(0, 3).map((v) => {
        const s = v / 255;
        return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const root = document.querySelector(selector);
    if (!root) return [];
    return [...root.querySelectorAll('*'), root]
      .filter((el) =>
        [...el.childNodes].some((n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim()),
      )
      .filter((el) => el.getClientRects().length > 0)
      .map((el) => {
        const bg = background(el);
        const fg = over(rgba(getComputedStyle(el).color), bg);
        const [l1, l2] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
        return {
          text: [...el.childNodes]
            .filter((n) => n.nodeType === Node.TEXT_NODE)
            .map((n) => n.textContent.trim())
            .join(' ')
            .slice(0, 30),
          contrast: Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100,
        };
      });
  }, selector);
