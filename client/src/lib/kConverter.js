const kConverter = (num) => {
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + "k";
  else return num;
};

export default kConverter;