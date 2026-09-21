import type { PortfolioData } from "@/types/portfolio";

let cachedPortfolioData: PortfolioData | null = null;

export async function getPortfolioData(): Promise<PortfolioData> {
	if (cachedPortfolioData) return cachedPortfolioData;

	const data = await import("./portfolio.json");
	cachedPortfolioData = data.default as PortfolioData;
	return cachedPortfolioData;
}
