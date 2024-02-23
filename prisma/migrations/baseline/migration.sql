-- CreateTable
CREATE TABLE `annotations` (
    `url` VARCHAR(1000) NOT NULL,
    `uid` VARCHAR(100) NOT NULL,
    `annotation_no` TINYINT NOT NULL,
    `annotation_type` CHAR(5) NOT NULL,

    INDEX `uid`(`uid`),
    PRIMARY KEY (`url`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `common_names` (
    `spec_name` VARCHAR(100) NOT NULL,
    `common_name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`spec_name`, `common_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `image_set` (
    `spec_name` VARCHAR(100) NOT NULL,
    `spec_acquis_date` DATE NOT NULL,
    `set_no` TINYINT NOT NULL,
    `imaged_by` VARCHAR(25) NOT NULL,
    `imaged_date` DATE NOT NULL,
    `images_link` VARCHAR(100) NULL,
    `no_of_images` SMALLINT NOT NULL,
    `uid` VARCHAR(100) NULL,

    INDEX `spec_acquis_date`(`spec_acquis_date`),
    INDEX `uid`(`uid`),
    PRIMARY KEY (`spec_name`, `spec_acquis_date`, `set_no`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `model` (
    `uid` VARCHAR(100) NOT NULL,
    `spec_name` VARCHAR(100) NOT NULL,
    `spec_acquis_date` DATE NOT NULL,
    `modeled_by` VARCHAR(25) NOT NULL,

    INDEX `spec_acquis_date`(`spec_acquis_date`),
    INDEX `spec_name`(`spec_name`),
    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `photo_annotation` (
    `url` VARCHAR(1000) NOT NULL,
    `website` VARCHAR(150) NULL,
    `author` VARCHAR(75) NOT NULL,
    `title` VARCHAR(100) NULL,
    `license` VARCHAR(75) NOT NULL,
    `annotator` VARCHAR(25) NOT NULL,
    `annotation` VARCHAR(4000) NOT NULL,

    PRIMARY KEY (`url`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `software` (
    `uid` VARCHAR(100) NOT NULL,
    `software` VARCHAR(25) NOT NULL,

    PRIMARY KEY (`uid`, `software`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `species` (
    `spec_name` VARCHAR(100) NOT NULL,
    `genus` VARCHAR(50) NOT NULL,
    `is_local` BOOLEAN NOT NULL,

    PRIMARY KEY (`spec_name`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `specimen` (
    `spec_name` VARCHAR(100) NOT NULL,
    `spec_acquis_date` DATE NOT NULL,
    `procurer` VARCHAR(25) NOT NULL,

    UNIQUE INDEX `specimen_spec_acquis_date_key`(`spec_acquis_date`),
    INDEX `spec_acquis_date`(`spec_acquis_date`),
    PRIMARY KEY (`spec_name`, `spec_acquis_date`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `video_annotation` (
    `url` VARCHAR(1000) NOT NULL,
    `length` VARCHAR(4) NULL,

    PRIMARY KEY (`url`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `annotations` ADD CONSTRAINT `annotations_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `model`(`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `common_names` ADD CONSTRAINT `common_names_ibfk_1` FOREIGN KEY (`spec_name`) REFERENCES `species`(`spec_name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `image_set` ADD CONSTRAINT `image_set_ibfk_1` FOREIGN KEY (`spec_name`) REFERENCES `species`(`spec_name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `image_set` ADD CONSTRAINT `image_set_ibfk_2` FOREIGN KEY (`spec_acquis_date`) REFERENCES `specimen`(`spec_acquis_date`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `image_set` ADD CONSTRAINT `image_set_ibfk_3` FOREIGN KEY (`uid`) REFERENCES `model`(`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `model` ADD CONSTRAINT `model_ibfk_1` FOREIGN KEY (`spec_name`) REFERENCES `species`(`spec_name`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `model` ADD CONSTRAINT `model_ibfk_2` FOREIGN KEY (`spec_acquis_date`) REFERENCES `specimen`(`spec_acquis_date`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `photo_annotation` ADD CONSTRAINT `photo_annotation_ibfk_1` FOREIGN KEY (`url`) REFERENCES `annotations`(`url`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `software` ADD CONSTRAINT `software_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `model`(`uid`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `specimen` ADD CONSTRAINT `specimen_ibfk_1` FOREIGN KEY (`spec_name`) REFERENCES `species`(`spec_name`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `video_annotation` ADD CONSTRAINT `video_annotation_ibfk_1` FOREIGN KEY (`url`) REFERENCES `annotations`(`url`) ON DELETE RESTRICT ON UPDATE CASCADE;

