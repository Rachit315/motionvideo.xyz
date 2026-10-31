PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_sponsorship` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`billing` text DEFAULT 'monthly' NOT NULL,
	`subscription_id` text,
	`payment_id` text,
	`customer_id` text,
	`email` text NOT NULL,
	`tier` text NOT NULL,
	`status` text NOT NULL,
	`cancel_at_period_end` integer DEFAULT false NOT NULL,
	`next_billing_at` integer,
	`ends_at` integer,
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
-- Existing rows are paid monthly subscriptions; their subscription id becomes the row id.
INSERT INTO `__new_sponsorship`("id", "user_id", "billing", "subscription_id", "customer_id", "email", "tier", "status", "cancel_at_period_end", "next_billing_at", "name", "url", "tagline", "logo", "cover", "dark_invert", "category_kind", "category", "review", "review_note", "created_at", "updated_at") SELECT "subscription_id", "user_id", 'monthly', "subscription_id", "customer_id", "email", "tier", "status", "cancel_at_period_end", "next_billing_at", "name", "url", "tagline", "logo", "cover", "dark_invert", "category_kind", "category", "review", "review_note", "created_at", "updated_at" FROM `sponsorship`;--> statement-breakpoint
DROP TABLE `sponsorship`;--> statement-breakpoint
ALTER TABLE `__new_sponsorship` RENAME TO `sponsorship`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `sponsorship_user_idx` ON `sponsorship` (`user_id`);--> statement-breakpoint
CREATE INDEX `sponsorship_email_idx` ON `sponsorship` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `sponsorship_subscription_idx` ON `sponsorship` (`subscription_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `sponsorship_payment_idx` ON `sponsorship` (`payment_id`);