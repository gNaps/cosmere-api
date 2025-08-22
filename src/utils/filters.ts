import qs from "qs";

const operatorsMap: Record<string, string> = {
  $eq: "equals",
  $ne: "not",
  $lt: "lt",
  $lte: "lte",
  $gt: "gt",
  $gte: "gte",
  $contains: "contains",
  $startsWith: "startsWith",
  $endsWith: "endsWith",
  $in: "in",
  $notIn: "notIn",
};

type PrismaFilter = Record<string, any>;

export function parseFilters(query: Record<string, any>): PrismaFilter {
  if (!query.filters) return {};

  const rawFilters =
    typeof query.filters === "string" ? qs.parse(query.filters) : query.filters;

  function traverse(obj: any): any {
    console.log("Traversing object:", obj);
    if (typeof obj !== "object" || obj === null) return obj;

    const keys = Object.keys(obj);

    // Caso array-like
    if (keys.every((k) => /^\d+$/.test(k))) {
      return keys.map((k) => traverse(obj[k]));
    }

    // Caso oggetto normale
    const result: any = {};
    for (const key of keys) {
      const value = obj[key];

      if (typeof value === "object" && value !== null) {
        const subKeys = Object.keys(value);
        console.log("Subkeys:", subKeys);

        // Se è terminale [operatore][valore]
        if (subKeys.length === 1) {
          const op = subKeys[0];
          const v = value[op];

          // v può essere un oggetto {Empire: ""} → trasformiamo in stringa
          if (
            typeof v === "object" &&
            Object.keys(v).length === 1 &&
            v[Object.keys(v)[0]] === ""
          ) {
            console.log("v1", v);
            // qs.parse converte [Empire] in { Empire: "" } oppure { "": "" }
            result[key] = { [op.slice(1)]: Object.keys(v)[0] };
          } else {
            console.log("v2", v);
            result[key] = { [op.slice(1)]: traverse(v) };
          }
        } else {
          // non terminale, ricorsione
          if (key.startsWith("$")) {
            if (key === "$and" || key === "$or") {
              result[key.slice(1).toUpperCase()] = traverse(value);
            } else {
              result[key.slice(1)] = traverse(value);
            }
          } else {
            result[key] = traverse(value);
          }
        }
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  return traverse(rawFilters);
}

/**
 * Trasforma filtri con "dot notation" su relazioni in Prisma nested (some)
 */
function transformField(
  field: string,
  operator: string,
  value: any
): PrismaFilter {
  if (field.includes(".")) {
    const [relation, ...rest] = field.split(".");
    const nestedField = rest.join(".");
    return {
      [relation]: transformField(nestedField, operator, value),
    };
  } else {
    return {
      [field]: {
        [operator]: castValue(value),
        ...(operator === "contains" && { mode: "insensitive" }),
      },
    };
  }
}

export function parseStringFilters(filterStr: string): PrismaFilter {
  filterStr = filterStr.trim();

  // Controlla $and / $or
  const logicalMatch = filterStr.match(/^\$(and|or)\((.*)\)$/);
  if (logicalMatch) {
    const op = logicalMatch[1].toUpperCase(); // AND / OR
    const inner = logicalMatch[2];

    const conditions = splitConditions(inner);
    return { [op]: conditions.map(parseStringFilters) };
  }

  // Condizione terminale: field:operator:value
  const parts = filterStr.split(":");
  if (parts.length < 3)
    throw new Error("Filtro terminale non valido: " + filterStr);

  const field = parts[0];
  const operatorRaw = parts[1];
  const value = parts.slice(2).join(":"); // per valori che contengono ":"

  const operator = operatorsMap[operatorRaw];
  if (!operator) throw new Error("Operatore non supportato: " + operatorRaw);

  return transformField(field, operator, value);
}

/**
 * Split delle condizioni separate da ',' rispettando eventuali parentesi annidate
 */
function splitConditions(str: string): string[] {
  const result: string[] = [];
  let depth = 0;
  let buffer = "";

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === "(") depth++;
    if (char === ")") depth--;
    if (char === "," && depth === 0) {
      result.push(buffer.trim());
      buffer = "";
    } else {
      buffer += char;
    }
  }

  if (buffer.trim()) result.push(buffer.trim());
  return result;
}

function castValue(value: any): any {
  if (value === "null") return null;
  if (value === "true") return true;
  if (value === "false") return false;
  if (!isNaN(Number(value)) && value.trim() !== "") return Number(value);
  // Date ISO check
  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z?$/.test(value)
  ) {
    return new Date(value);
  }
  return value;
}
