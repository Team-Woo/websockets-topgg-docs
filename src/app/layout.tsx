import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/css/globals.css";
import "@/css/markdown.css";
import "@/css/codeblocks.css"

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider/theme-provider";
import NavBar from "@/components/navbar";
import { Separator } from "@/components/ui/separator";



const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
	title: "Docs: Websockets for Top.gg",
	description:
		"Allows creating Websockets instead of webhooks for Top.gg bots. Making it easier to get real-time data.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="scroll-smooth" suppressHydrationWarning>
			<body className={cn("h-full bg-background font-sans antialiased", inter.variable)}>

				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<NavBar />
					<Separator />
					<main className="max-w-screen-2xl flex justify-center mx-auto pt-16">{children}</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
