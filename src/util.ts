export function getMetricName(name: string, target: any, descriptor: PropertyDescriptor) {
    return name.length !== 0 ? name : target.constructor.name + "#" + descriptor.value.name;
}
