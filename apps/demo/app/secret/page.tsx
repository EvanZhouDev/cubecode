import { checkPassword } from "./actions";

interface SecretPageProps {
	searchParams: Promise<{ message?: string; error?: string }>;
}

export default async function SecretPage({ searchParams }: SecretPageProps) {
	const params = await searchParams;
	const { message, error } = params;

	return (
		<div className="flex flex-col items-center gap-4 px-5">
			<div className="text-black dark:text-white text-center text-xl max-w-2xl">
				Enter my password to unlock hidden content.
			</div>
			<div className="text-gray-500 dark:text-gray-100 text-center max-w-2xl">
				At the start of the <a href="https://www.youtube.com/watch?v=l9ZStTs914k" className="underline!">CubeCode YouTube Video</a>, I said the Rubik's cube I showed was my password. Figure out the password/secret message on that cube, and enter it below.
			</div>

			{message && (
                <div className="max-w-2xl w-full p-4 border border-green-300 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="text-green-700 dark:text-green-300 text-center">
                        {decodeURIComponent(message)
                            .split("\n")
                            .map((line, index) => (
                                <div key={index}>{line}</div>
                            ))}
                    </div>
                </div>
			)}

			{error && (
				<div className="max-w-2xl w-full p-4 border border-red-300 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/20">
					<p className="text-red-700 dark:text-red-300 text-center">
						❌ {error}
					</p>
				</div>
			)}

			<form
				action={checkPassword}
				className="max-w-2xl w-full flex flex-col gap-4"
			>
				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-black dark:text-white mb-2"
					>
						Password
					</label>
					<input
						type="password"
						id="password"
						name="password"
						required
						className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						placeholder="Enter secret password..."
					/>
				</div>

				<button
					type="submit"
					className="px-8 py-3 rounded-lg font-medium transition-colors text-black dark:text-white border-1 hover:bg-gray-200 dark:hover:bg-gray-900"
				>
					Unlock Secret
				</button>
			</form>

			<div className="text-gray-500 dark:text-gray-100 text-center max-w-2xl text-sm">
				Hint: You are given enough information to solve this! Try to deduce the last face of the cube
			</div>
		</div>
	);
}
