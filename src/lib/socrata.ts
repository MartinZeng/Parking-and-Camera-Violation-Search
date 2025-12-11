// this is where we will make queries and parse them
import { Violation } from '../app/types/index';

const API_ENDPOINT = `https://data.cityofnewyork.us/api/v3/views/nc67-uf89/query.json`;
const API_TOKEN = 'YUB3iukmGyYtZlDXruErL1D4m';
// const API_KEY = `ad8jckpni5pfuan1y66exlpy1`;
// const API_KEY_SECRET = '6bqdaavynupsxzpivz7s4ergdgos3xcg1yl9a1695vn6wop85v';

// clean up license plate input submitted by user
function cleanPlate(plate: string): string {
  return plate.replace(/\s+/g, '').toUpperCase();
}

export async function searchByPlate(plate: string): Promise<Violation[]> {
  try {
    // Updating the license plate to the cleaned plate
    plate = cleanPlate(plate);
    const url = new URL(API_ENDPOINT);
    url.searchParams.append('$$app_token', API_TOKEN);
    const query = `SELECT * WHERE plate = '${plate}'`;

    // const query = `SELECT * WHERE plate = '${plate}'`;
    console.log(`API ENDPOINT: ${API_ENDPOINT}${encodeURIComponent(query)}`);
    // Making fetch request to NYC Open Data - Open Parking and Camera Violations
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-App-Token': API_TOKEN,
      },
      mode: 'cors',
      body: JSON.stringify({ query: query }),
    });

    // Error handling
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API returned status: ${response.status}: ${errorText}`);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    console.log('socrata data', data);
    return data;
  } catch (e) {
    console.error('Search Failed:', e);
    throw e;
  }
}

// (async () => {
//   try {
//     const results = await searchByPlate('luh1670');
//     console.log('Search Results:', results);
//   } catch (error) {
//     // Error already logged inside searchByPlate, but handle final exit here if needed
//     console.error('Script execution failed.');
//   }
// })();
