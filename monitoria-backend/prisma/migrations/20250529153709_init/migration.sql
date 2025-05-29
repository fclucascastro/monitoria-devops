-- CreateTable
CREATE TABLE "Monitoria" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "professor" TEXT NOT NULL,
    "horario" TEXT NOT NULL,
    "local" TEXT NOT NULL,

    CONSTRAINT "Monitoria_pkey" PRIMARY KEY ("id")
);
