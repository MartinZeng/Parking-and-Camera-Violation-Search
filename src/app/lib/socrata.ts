// this is where we will make queries and parse them
import { Violation } from '../types/index';

const API_ENDPOINT = `https://data.cityofnewyork.us/api/v3/views/nc67-uf89/query.json?pageNumber=1&pageSize=10&app_token=$YUB3iukmGyYtZlDXruErL1D4m&query=`;
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
    // const query = `SELECT * WHERE plate = '${plate}' ORDER BY issue_date DESC LIMIT 10`;
    const query = `SELECT * WHERE plate = '${plate}'`;

    // Making fetch request to NYC Open Data - Open Parking and Camera Violations
    const response = await fetch(
      `${API_ENDPOINT}${encodeURIComponent(query)}`,
      {
        headers: {
          Accept: 'application/json',
          'X-App-Token': API_TOKEN,
        },
      }
    );

    // Error handling
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API returned status: ${response.status}: ${errorText}`);
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (e) {
    console.error('Search Failed:', e);
    throw e;
  }
}

// (async () => {
//   try {
//     const results = await searchByPlate('t110874c');
//     console.log('Search Results:', results);
//   } catch (error) {
//     // Error already logged inside searchByPlate, but handle final exit here if needed
//     console.error('Script execution failed.');
//   }
// })();
