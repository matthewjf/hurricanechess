function formatter(val, unit, suffix) {
  if (unit === 'second') return `< 1 min ${suffix}`;
  switch (unit){
    case 'minute':
      unit = 'min';
      break;
    case 'hour':
      unit = 'hr';
      break;
    case 'day':
      unit = 'day';
      break;
    case 'week':
      unit = 'wk';
      break;
    case 'month':
      unit = 'mon';
      break;
    case 'year':
      unit = 'yr';
      break;
  }
  if (val > 1) unit += 's';
  return `${val} ${unit} ${suffix}`;
}

export default formatter;
