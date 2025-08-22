-- CreateTable
CREATE TABLE "public"."Series" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "planetId" TEXT NOT NULL,

    CONSTRAINT "Series_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Planet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Planet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "imageCredit" TEXT,
    "planetId" TEXT NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Fragment" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Fragment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Investiture" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fragmentId" TEXT,
    "planetId" TEXT,

    CONSTRAINT "Investiture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BookCharacter" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,

    CONSTRAINT "BookCharacter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PlanetFragment" (
    "id" TEXT NOT NULL,
    "planetId" TEXT NOT NULL,
    "fragmentId" TEXT NOT NULL,

    CONSTRAINT "PlanetFragment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CharacterInvestiture" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "investitureId" TEXT NOT NULL,

    CONSTRAINT "CharacterInvestiture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookCharacter_bookId_characterId_key" ON "public"."BookCharacter"("bookId", "characterId");

-- CreateIndex
CREATE UNIQUE INDEX "PlanetFragment_planetId_fragmentId_key" ON "public"."PlanetFragment"("planetId", "fragmentId");

-- CreateIndex
CREATE UNIQUE INDEX "CharacterInvestiture_characterId_investitureId_key" ON "public"."CharacterInvestiture"("characterId", "investitureId");

-- AddForeignKey
ALTER TABLE "public"."Series" ADD CONSTRAINT "Series_planetId_fkey" FOREIGN KEY ("planetId") REFERENCES "public"."Planet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Book" ADD CONSTRAINT "Book_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "public"."Series"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Character" ADD CONSTRAINT "Character_planetId_fkey" FOREIGN KEY ("planetId") REFERENCES "public"."Planet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Investiture" ADD CONSTRAINT "Investiture_fragmentId_fkey" FOREIGN KEY ("fragmentId") REFERENCES "public"."Fragment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Investiture" ADD CONSTRAINT "Investiture_planetId_fkey" FOREIGN KEY ("planetId") REFERENCES "public"."Planet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookCharacter" ADD CONSTRAINT "BookCharacter_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "public"."Book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookCharacter" ADD CONSTRAINT "BookCharacter_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "public"."Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlanetFragment" ADD CONSTRAINT "PlanetFragment_planetId_fkey" FOREIGN KEY ("planetId") REFERENCES "public"."Planet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PlanetFragment" ADD CONSTRAINT "PlanetFragment_fragmentId_fkey" FOREIGN KEY ("fragmentId") REFERENCES "public"."Fragment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CharacterInvestiture" ADD CONSTRAINT "CharacterInvestiture_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "public"."Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CharacterInvestiture" ADD CONSTRAINT "CharacterInvestiture_investitureId_fkey" FOREIGN KEY ("investitureId") REFERENCES "public"."Investiture"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
