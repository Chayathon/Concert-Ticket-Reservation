-- Enforce 1 active reservation record per user per concert
CREATE UNIQUE INDEX "Reservation_userId_concertId_key" ON "Reservation"("userId", "concertId");
