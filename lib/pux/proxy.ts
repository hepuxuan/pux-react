const actionMap: any = {};

function proxy(
  target: Object,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<any>
): any {
  const originalMethod = descriptor.value;
  actionMap[`${(target as any).name}${originalMethod.name}`] = originalMethod;
  descriptor.value = function(...args: any[]) {
    if (process.env.IS_BROWSER) {
      return fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          action: `${(target as any).name}${originalMethod.name}`,
          params: [...arguments]
        })
      }).then(res => res.json());
    } else {
      return originalMethod.apply(this, args);
    }
  };
  return descriptor;
}

export { proxy, actionMap };
