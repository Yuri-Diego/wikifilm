-- CreateTable
CREATE TABLE "favorites" (
    "id" SERIAL NOT NULL,
    "tmdb_movie_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "poster_path" TEXT,
    "backdrop_path" TEXT,
    "rating" DOUBLE PRECISION,
    "year" TEXT,
    "overview" TEXT,
    "release_date" TEXT,
    "runtime" INTEGER,
    "genres" TEXT[],

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "share_links" (
    "id" SERIAL NOT NULL,
    "share_id" TEXT NOT NULL,
    "movies_data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "share_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "favorites_tmdb_movie_id_key" ON "favorites"("tmdb_movie_id");

-- CreateIndex
CREATE UNIQUE INDEX "share_links_share_id_key" ON "share_links"("share_id");
