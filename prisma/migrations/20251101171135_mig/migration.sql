-- CreateTable
CREATE TABLE "Player" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "base_price" INTEGER NOT NULL,
    "current_bid" INTEGER NOT NULL,
    "current_bidder_id" UUID,
    "image_url" TEXT,
    "description" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'upcoming',
    "auction_start_time" TIMESTAMPTZ,
    "auction_end_time" TIMESTAMPTZ,
    "version" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bid" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "player_id" UUID NOT NULL,
    "bidder_id" UUID,
    "bidder_name" VARCHAR(100),
    "bid_amount" INTEGER NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" VARCHAR(50),

    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "total_bids" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "subject" VARCHAR(200) NOT NULL,
    "message" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "submitted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip_address" VARCHAR(50),

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Poll" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "reset_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PollVote" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "poll_id" UUID NOT NULL,
    "option_id" VARCHAR(50) NOT NULL,
    "voter_fingerprint" VARCHAR(255) NOT NULL,
    "voter_ip" VARCHAR(50),
    "voted_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reset_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PollVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Player_status_idx" ON "Player"("status");

-- CreateIndex
CREATE INDEX "Player_auction_end_time_idx" ON "Player"("auction_end_time");

-- CreateIndex
CREATE INDEX "Bid_player_id_idx" ON "Bid"("player_id");

-- CreateIndex
CREATE INDEX "Bid_timestamp_idx" ON "Bid"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Enquiry_email_idx" ON "Enquiry"("email");

-- CreateIndex
CREATE INDEX "Enquiry_submitted_at_idx" ON "Enquiry"("submitted_at");

-- CreateIndex
CREATE INDEX "PollVote_poll_id_idx" ON "PollVote"("poll_id");

-- CreateIndex
CREATE UNIQUE INDEX "PollVote_poll_id_voter_fingerprint_reset_date_key" ON "PollVote"("poll_id", "voter_fingerprint", "reset_date");

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PollVote" ADD CONSTRAINT "PollVote_poll_id_fkey" FOREIGN KEY ("poll_id") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
