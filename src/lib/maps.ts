const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!;

export async function geocodeAddress(
  address: string,
): Promise<{ lat: number; lng: number } | null> {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}&region=BR&language=pt-BR`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.status !== "OK" || !data.results[0]) return null;
  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
}
