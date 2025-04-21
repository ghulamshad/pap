-- CreateTable
CREATE TABLE `Video` (
    `id` VARCHAR(191) NOT NULL,
    `videoId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `publishedAt` DATETIME(3) NOT NULL,
    `thumbnailUrl` VARCHAR(191) NOT NULL,
    `channelTitle` VARCHAR(191) NOT NULL,
    `channelId` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Video_videoId_key`(`videoId`),
    INDEX `Video_publishedAt_idx`(`publishedAt`),
    INDEX `Video_channelId_idx`(`channelId`),
    INDEX `Video_isActive_idx`(`isActive`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
