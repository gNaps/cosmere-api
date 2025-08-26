import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function loadJsonData() {
  const dataDir = path.join(process.cwd(), "data");
  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith(".json"));

  const dataMap: Record<string, any[]> = {};
  for (const file of files) {
    const name = path.basename(file, ".json");
    dataMap[name] = JSON.parse(
      fs.readFileSync(path.join(dataDir, file), "utf-8")
    );
  }
  return dataMap;
}

async function main() {
  const data = await loadJsonData();

  // Svuotiamo il DB
  await prisma.seriesPlanet.deleteMany();
  await prisma.book.deleteMany();
  await prisma.series.deleteMany();
  await prisma.planet.deleteMany();
  await prisma.shard.deleteMany();
  await prisma.investiture.deleteMany();
  await prisma.shardInvestiture.deleteMany();

  // Inseriamo i pianeti
  await prisma.planet.createMany({
    data: data.planets,
  });

  // Inseriamo le serie
  await prisma.series.createMany({
    data: data.series,
  });

  // Inseriamo la tabella ponte SeriesPlanet
  if (data.seriesPlanets) {
    for (const sp of data.seriesPlanets) {
      await prisma.seriesPlanet.create({
        data: sp,
      });
    }
  }

  // Inseriamo i libri
  if (data.books) {
    await prisma.book.createMany({
      data: data.books,
    });
  }

  // Inseriamo i frammenti
  if (data.shards) {
    await prisma.shard.createMany({
      data: data.shards,
    });
  }

  // Inseriamo le investiture
  if (data.investitures) {
    await prisma.investiture.createMany({
      data: data.investitures,
    });
  }

  // Inseriamo la tabella ponte ShardInvestiture
  if (data.shardInvestitures) {
    for (const si of data.shardInvestitures) {
      await prisma.shardInvestiture.create({
        data: si,
      });
    }
  }

  console.log("Seed completato!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
