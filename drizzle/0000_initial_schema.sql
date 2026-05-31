CREATE TABLE IF NOT EXISTS `events` (
	`date` integer PRIMARY KEY NOT NULL,
	`menstruation_light` integer DEFAULT 0 NOT NULL,
	`menstruation_moderate` integer DEFAULT 0 NOT NULL,
	`menstruation_heavy` integer DEFAULT 0 NOT NULL,
	`menstruation_spotting` integer DEFAULT 0 NOT NULL,
	`ovulation` integer DEFAULT 0 NOT NULL,
	`pill` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `partner_insights` (
	`day_in_cycle` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `symptoms` (
	`date` integer PRIMARY KEY NOT NULL,
	`symptoms_intestinal_problems` integer DEFAULT 0 NOT NULL,
	`symptoms_appetite_changes` integer DEFAULT 0 NOT NULL,
	`symptoms_bloating` integer DEFAULT 0 NOT NULL,
	`symptoms_chills` integer DEFAULT 0 NOT NULL,
	`symptoms_cramps` integer DEFAULT 0 NOT NULL,
	`symptoms_dry_skin` integer DEFAULT 0 NOT NULL,
	`symptoms_insomnia` integer DEFAULT 0 NOT NULL,
	`symptoms_nausea` integer DEFAULT 0 NOT NULL,
	`discharge_watery` integer DEFAULT 0 NOT NULL,
	`discharge_creamy` integer DEFAULT 0 NOT NULL,
	`discharge_sticky` integer DEFAULT 0 NOT NULL,
	`discharge_dry` integer DEFAULT 0 NOT NULL,
	`sex_drive_very_low` integer DEFAULT 0 NOT NULL,
	`sex_drive_low` integer DEFAULT 0 NOT NULL,
	`sex_drive_high` integer DEFAULT 0 NOT NULL,
	`sex_drive_very_high` integer DEFAULT 0 NOT NULL,
	`exercise_running` integer DEFAULT 0 NOT NULL,
	`exercise_cycling` integer DEFAULT 0 NOT NULL,
	`exercise_hiking` integer DEFAULT 0 NOT NULL,
	`exercise_gym` integer DEFAULT 0 NOT NULL,
	`mood_angry` integer DEFAULT 0 NOT NULL,
	`mood_happy` integer DEFAULT 0 NOT NULL,
	`mood_neutral` integer DEFAULT 0 NOT NULL,
	`mood_sad` integer DEFAULT 0 NOT NULL,
	`mood_annoyed` integer DEFAULT 0 NOT NULL,
	`mood_sensitive` integer DEFAULT 0 NOT NULL,
	`mood_irritated` integer DEFAULT 0 NOT NULL
);
