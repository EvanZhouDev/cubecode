"use server";

import { redirect } from "next/navigation";
import { createHash, timingSafeEqual } from "crypto";

// Get password and message from environment variables
const SECRET_PASSWORD = process.env.SECRET_PASSWORD;
const SECRET_MESSAGE = process.env.SECRET_MESSAGE;

if (!SECRET_PASSWORD) {
	throw new Error("SECRET_PASSWORD environment variable is not set");
}

if (!SECRET_MESSAGE) {
	throw new Error("SECRET_MESSAGE environment variable is not set");
}

// Hash the correct password from environment
const ACTUAL_CORRECT_HASH = createHash("sha256")
	.update(SECRET_PASSWORD)
	.digest("hex");

export async function checkPassword(formData: FormData) {
	const password = formData.get("password") as string;

	if (!password) {
		redirect("/secret?error=Please enter a password");
	}

	// Hash the provided password
	const providedPasswordHash = createHash("sha256")
		.update(password.trim())
		.digest("hex");

	const isMatch = timingSafeEqual(
		Buffer.from(providedPasswordHash, "hex"),
		Buffer.from(ACTUAL_CORRECT_HASH, "hex")
	);

	if (isMatch) {
		// Success - redirect with the secret message
		const encodedMessage = encodeURIComponent(SECRET_MESSAGE!);
		redirect(`/secret?message=${encodedMessage}`);
	} else {
		// Failure - redirect with error
		redirect("/secret?error=Incorrect password. Try again!");
	}
}
