CREATE TABLE `sponsorship` (
	`subscription_id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`customer_id` text NOT NULL,
	`email` text NOT NULL,
	`tier` text NOT NULL,
	`status` text NOT NULL,
	`cancel_at_period_end` integer DEFAULT false NOT NULL,
	`next_billing_at` integer,
	`name` text,
	`url` text,
	`tagline` text,
	`logo` text,
	`cover` text,
	`dark_invert` integer DEFAULT false NOT NULL,
	`category_kind` text,
	`category` text,
	`review` text DEFAULT 'draft' NOT NULL,
	`review_note` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `sponsorship_user_idx` ON `sponsorship` (`user_id`);--> statement-breakpoint
CREATE INDEX `sponsorship_email_idx` ON `sponsorship` (`email`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_bookmarks` (
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`item_id` text NOT NULL,
	`created_at` integer NOT NULL,
	PRIMARY KEY(`user_id`, `kind`, `item_id`),
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_bookmarks`("user_id", "kind", "item_id", "created_at") SELECT "user_id", 'video', "video_slug", "created_at" FROM `bookmarks`;--> statement-breakpoint
DROP TABLE `bookmarks`;--> statement-breakpoint
ALTER TABLE `__new_bookmarks` RENAME TO `bookmarks`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
ALTER TABLE `community_submission` ADD `featured_item_id` text;--> statement-breakpoint
ALTER TABLE `community_submission` ADD `reviewed_at` integer;