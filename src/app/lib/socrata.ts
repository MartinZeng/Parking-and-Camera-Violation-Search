// this is where we will make queries and parse them
import { Violation } from '../types/index';

// const API_ENDPOINT = `https://data.cityofnewyork.us/api/v3/views/nc67-uf89/query.json?pageNumber=1&pageSize=10&app_token=$YUB3iukmGyYtZlDXruErL1D4m`;
const API_ENDPOINT = `https://data.cityofnewyork.us/api/v3/views/nc67-uf89/query.json?pageNumber=1&pageSize=10&app_token=$YUB3iukmGyYtZlDXruErL1D4m&query=`;
// const API_KEY = `ad8jckpni5pfuan1y66exlpy1`;
const API_TOKEN = 'YUB3iukmGyYtZlDXruErL1D4m';
// const API_KEY_SECRET = '6bqdaavynupsxzpivz7s4ergdgos3xcg1yl9a1695vn6wop85v';

// clean up license plate input submitted by user
function cleanPlate(plate: string): string {
  return plate.replace(/\s+/g, '').toUpperCase();
}

// normalize the ticket data structure
export type NormalizedTicket = {
  summonsNumber: string;
  plate: string;
  state: string;
  issueDate: string;
  violation: string;
  fineAmount: number;
};

// search for violations by license plate
export async function searchByPlate(plate: string): Promise<any[]> {
  try {
    // Updating the license plate to the cleaned plate
    plate = cleanPlate(plate);
    // const query = `SELECT * WHERE plate = '${plate}' ORDER BY issue_date DESC LIMIT 10`;
    const query = `SELECT * WHERE plate = '${plate}'`;

    // Constructing the full API URL with query parameters
    const url = new URL(API_ENDPOINT);
    url.searchParams.set('pageNumber', '1');
    url.searchParams.set('pageSize', '10');
    url.searchParams.set('query', query);

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

    // Parsing the data into Violation objects
    const columns = data.columns.map((col: any) => col.name as string);
    
    const results: Violation[] = [];// Array to hold parsed violation objects
// Iterate over each row in the data
    for (const row of data.rows as any[][]) {
      const obj: Record<string, any> = {};// Temporary object to hold column-value pairs
      // Map each column to its corresponding value in the row
      columns.forEach((colName, idx) => {// For each column name and its index
        obj[colName] = row[idx];// Assign the value from the row to the object using the column name as key
      });

      // Map to your Violation type (adjust fields if your type is different)
      results.push({
        summonsNumber: obj.summons_number ?? '',
        plate: obj.plate ?? '',
        state: obj.state ?? obj.registration_state ?? '',
        issueDate: obj.issue_date ?? '',
        violationTime: obj.violation_time ?? '',
        violation: obj.violation_description ?? obj.violation ?? '',
        fineAmount: Number(obj.fine_amount ?? 0),
        status: obj.violation_status ?? '',
      });
    }


  } catch (e) {
    console.error('Search Failed:', e);
    throw e;
  }
}

(async () => {
  try {
    const results = await searchByPlate('FFS4911');
    console.log('Search Results:', results);
  } catch (error) {
    // Error already logged inside searchByPlate, but handle final exit here if needed
    console.error('Script execution failed.');
  }
})();
