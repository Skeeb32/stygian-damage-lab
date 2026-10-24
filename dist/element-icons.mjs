const elementFiles=Object.freeze({
  Anemo:'element-anemo.svg',
  Cryo:'element-cryo.svg',
  Dendro:'element-dendro.svg',
  Electro:'element-electro.svg',
  Geo:'element-geo.svg',
  Hydro:'element-hydro.svg',
  Pyro:'element-pyro.svg'
});

export function elementIconUrl(element){
  const file=elementFiles[String(element||'')];
  return file?`./assets/${file}`:null;
}
