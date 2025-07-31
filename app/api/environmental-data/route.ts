import { NextRequest, NextResponse } from "next/server";

const simulateApiDelay = () =>
  new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000));

const generateSolarData = (lat: number, lng: number) => {
  const baseSavings = Math.max(0, 200 + (lat - 37) * 50 + Math.random() * 300);
  return {
    monthlySavings: Math.round(baseSavings),
  };
};

const generateAirQualityData = (lat: number, lng: number) => {
  const baseAQI = Math.max(10, 30 + Math.random() * 100);
  return {
    aqi: Math.round(baseAQI),
  };
};

const generatePollenData = (lat: number, lng: number) => {
  const pollenTypes = ["TREE", "GRASS", "WEED"];
  const pollenTypeInfo = pollenTypes.map((type) => ({
    code: type,
    indexInfo: {
      value: Math.floor(Math.random() * 5),
    },
  }));

  return {
    dailyInfo: [
      {
        date: new Date().toISOString().split("T")[0],
        pollenTypeInfo,
      },
    ],
  };
};

export async function POST(req: NextRequest) {
  try {
    const { lat, lng } = await req.json();

    if (
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      Number.isNaN(lat) ||
      Number.isNaN(lng)
    ) {
      return NextResponse.json(
        { error: "Invalid latitude or longitude" },
        { status: 400 }
      );
    }

    await simulateApiDelay();

    const solar = generateSolarData(lat, lng);
    const airQuality = generateAirQualityData(lat, lng);
    const pollen = generatePollenData(lat, lng);

    return NextResponse.json({
      solar,
      airQuality,
      pollen,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch environmental data" },
      { status: 500 }
    );
  }
}
