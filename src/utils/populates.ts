interface SelectObject {
  [key: string]: any;
}

/**
 * parsePopulate("series[id,title],characters[id,name,image]")
 * =>
 * {
 *   series: { select: { id: true, title: true } },
 *   characters: { select: { id: true, name: true, image: true } }
 * }
 */
export function parsePopulate(populateStr: string): SelectObject {
  if (!populateStr) return {};

  const result: SelectObject = {};

  // Split per ogni "relazione[fields]" rispettando eventuali virgole nei campi
  // Si assume che le relazioni siano separate da ',' ma i campi sono tra []
  const regex = /(\w+)\[([^\]]+)\]/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(populateStr)) !== null) {
    const relName = match[1]; // es: "series"
    const fieldsStr = match[2]; // es: "id,title"
    const fields = fieldsStr.split(",").map((f) => f.trim());

    result[relName] = { select: {} };
    fields.forEach((f) => {
      result[relName].select[f] = true;
    });
  }

  return result;
}

export function parseSelect(fields: any): SelectObject {
  console.log("parseSelect", fields);
  return fields.split(",").reduce((acc: SelectObject, f: string) => {
    acc[f.trim()] = true;
    return acc;
  }, {});
}
