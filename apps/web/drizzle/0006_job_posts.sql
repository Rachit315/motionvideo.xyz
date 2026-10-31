CREATE TABLE `job_post` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`plan` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`title` text NOT NULL,
	`company` text NOT NULL,
	`location` text NOT NULL,
	`remote` integer DEFAULT false NOT NULL,
	`type` text NOT NULL,
	`salary` text,
	`description` text NOT NULL,
	`apply_url` text NOT NULL,
	`logo` text,
	`payment_id` text,
	`paid_at` integer,
	`published_at` integer,
	`expires_at` integer,
	`review_note` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `job_post_user_idx` ON `job_post` (`user_id`);--> statement-breakpoint
CREATE INDEX `job_post_live_idx` ON `job_post` (`status`,`expires_at`);