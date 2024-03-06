export function omit<T extends object, K extends keyof T>(
  obj: T,
  props: ReadonlyArray<K>
): Omit<T, K> {
  if (props.length === 0) {
    // No props to omit at all!
    return { ...obj };
  }
  if (props.length === 1) {
    // Only one prop to omit.
    const [propName] = props;
    const { [propName]: omitted, ...remaining } = obj;
    return { ...remaining };
  }
  if (!props.some((prop) => prop in obj)) {
    return { ...obj };
  }
  const asSet = new Set(props);
  return Object.entries(obj)
    .filter(([key]) => !asSet.has(key as K))
    .reduce(
      (obj, acc) => {
        const [key, value] = acc as [Exclude<keyof T, K>, T[Exclude<keyof T, K>]];
        obj[key as Exclude<keyof T, K>] = value;
        return obj;
      },
      {} as Omit<T, K>
    );
}
