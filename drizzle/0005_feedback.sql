CREATE TABLE `feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`mood` text,
	`message` text NOT NULL,
	`page` text NOT NULL,
	`email` text,
	`user_id` text,
	`created_at` integer NOT NULL,
	`resolved_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `feedback_created_idx` ON `feedback` (`created_at`);