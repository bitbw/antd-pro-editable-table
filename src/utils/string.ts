/* eslint-disable @typescript-eslint/no-explicit-any */
export function fuzzyMatch(inputValue: string, targetValue: string) {
  const input = inputValue.toLowerCase();
  const target = targetValue.toLowerCase();

  let inputIndex = 0;
  let targetIndex = 0;

  while (inputIndex < input.length && targetIndex < target.length) {
    if (input[inputIndex] === target[targetIndex]) {
      inputIndex++;
    }
    targetIndex++;
  }

  return inputIndex === input.length;
}

export function generateSimpleUUID() {
  return (
    Date.now().toString(36) + // 时间戳转36进制
    Math.random().toString(36).substring(2)
  ) // 去掉前两位的 "0."
    .replace(/\./g, ""); // 移除可能的点，以保证字符串格式整洁
}
