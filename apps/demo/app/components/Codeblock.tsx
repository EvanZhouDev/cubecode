export default function Codeblock({
	text,
	title,
	description,
}: {
	text: string;
	title: string;
	description: string;
}) {
	return (
		<div className="flex w-full flex-col">
			<div className="flex justify-between items-center mb-2">
				<h3 className="text-lg font-semibold">{title}</h3>
				<span className="text-sm text-gray-400">{description}</span>
			</div>
			<div className="bg-gray-50 dark:bg-white/10 p-2 rounded-lg border mb-4 relative flex items-center">
				<code className="text-sm font-mono break-words flex-1 pr-8 overflow-hidden h-5">
					{text}
				</code>
				<button
					onClick={() => navigator.clipboard.writeText(text)}
					className="absolute right-1 p-1 hover:bg-gray-400/20 dark:hover:bg-white/20 rounded flex-shrink-0"
					title="Copy to clipboard"
				>
					📋
				</button>
			</div>
		</div>
	);
}
