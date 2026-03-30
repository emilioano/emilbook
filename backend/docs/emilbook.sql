-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema emilbook
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema emilbook
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `emilbook` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
USE `emilbook` ;

-- -----------------------------------------------------
-- Table `emilbook`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `emilbook`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`));


-- -----------------------------------------------------
-- Table `emilbook`.`posts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `emilbook`.`posts` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `post` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  INDEX `User_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `User`
    FOREIGN KEY (`user_id`)
    REFERENCES `emilbook`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `emilbook`.`comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `emilbook`.`comments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `post_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `parent_comment_id` INT NULL,
  `comment` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  INDEX `PostId_idx` (`post_id` ASC) VISIBLE,
  INDEX `comments_fk_user_id_idx` (`user_id` ASC) VISIBLE,
  INDEX `comments_fk_parent_id_idx` (`parent_comment_id` ASC) VISIBLE,
  CONSTRAINT `comments_fk_post_id`
    FOREIGN KEY (`post_id`)
    REFERENCES `emilbook`.`posts` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `comments_fk_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `emilbook`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `comments_fk_parent_id`
    FOREIGN KEY (`parent_comment_id`)
    REFERENCES `emilbook`.`comments` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `emilbook`.`reactions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `emilbook`.`reactions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `post_id` INT NULL,
  `comment_id` INT NULL,
  `reaction` VARCHAR(255) NULL,
  `created_at` TIMESTAMP NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  INDEX `user_id_idx` (`user_id` ASC) VISIBLE,
  INDEX `comment_id_idx` (`comment_id` ASC) VISIBLE,
  INDEX `post_id_idx` (`post_id` ASC) VISIBLE,
  CONSTRAINT `reactions_fk_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `emilbook`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `reactions_fk_comment_id`
    FOREIGN KEY (`comment_id`)
    REFERENCES `emilbook`.`comments` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `reactions_fk_post_id`
    FOREIGN KEY (`post_id`)
    REFERENCES `emilbook`.`posts` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
