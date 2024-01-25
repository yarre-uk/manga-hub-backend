export function convertToSecondsUtil(timeStr: string): number {
  const timeUnits: { [unit: string]: number } = {
    s: 1,
    m: 60,
    h: 60 * 60,
    d: 24 * 60 * 60,
    M: 30 * 24 * 60 * 60,
    y: 365 * 24 * 60 * 60,
  };

  if (!isNaN(timeStr as any)) {
    return parseInt(timeStr);
  }

  const match = timeStr.toLowerCase().match(/^(\d+)([smhdMy])$/);
  if (!match) {
    throw new Error(`Invalid time string: ${timeStr}`);
  }

  const [, numStr, unit] = match;
  const num = parseInt(numStr);
  const multiplier = timeUnits[unit];

  if (multiplier === undefined) {
    throw new Error(`Invalid time unit in string: ${timeStr}`);
  }

  return num * multiplier;
}
