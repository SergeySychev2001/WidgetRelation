export function getOrCreate<K, V>(map: Map<K, V>, key: K, create: () => V): V {
    if (!map.has(key)) {
        const value = create();
        map.set(key, value);
        return value;
    }
    return map.get(key)!;
}