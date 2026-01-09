function fitContain(
  containerW: number,
  containerH: number,
  mediaW: number,
  mediaH: number,
) {
  if (!containerW || !containerH || !mediaW || !mediaH) {
    return { width: undefined, height: undefined };
  }

  const scale = Math.min(containerW / mediaW, containerH / mediaH);

  return {
    width: Math.round(mediaW * scale),
    height: Math.round(mediaH * scale),
  };
}

export { fitContain };
