// import Image from 'next/image';
'use client';
import { useState } from 'react';
import { searchByPlate } from './lib/socrata';
import { Violation } from './types/index';
import './globals.css';

export default function Home() {
  //defining state for input and fetched data
  const [plate, setPlate] = useState('');
  const [violations, setViolations] = useState<Violation[]>([]);
  const [error, setError] = useState('');

  // clears input when cancel button is clicked
  function ClearInput() {
    setPlate('');
    setViolations([]);
  }

  // looks up info when search button is clicked
  const LookUp = async () => {
    if (!plate) return;
    setError('');

    try {
      const data = await searchByPlate(plate);
      setViolations(data);
    } catch (e) {
      setError('Search failed. Try again.');
      setViolations([]);
    }
  };

  return (
    <main>
      <div>
        <header>NYC Parking and Camera Violations</header>
        <form>
          <label>Search Your License Plate:</label>
          <label className='example-license'>
            <small>Ex: EFG4321</small>
          </label>
          <div className='input'>
            <input
              className='border border-blue-300 '
              type='text'
              placeholder='License plate'
              value={plate}
              onChange={(event) => setPlate(event.target.value)}
            ></input>
          </div>
          <div className='buttons'>
            <button
              className='bg-transparent hover:bg-teal-500 hover:text-white border border-teal-500 hover:border-transparent focus:ring-2 focus:outline-none focus:ring-teal-300 font-medium text-center py-2 px-4 rounded leading-5'
              type='reset'
              onClick={ClearInput}
            >
              Cancel
            </button>
            <button
              className='bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-300 hover:to-lime-300 focus:ring-2 focus:outline-none focus:ring-lime-300 font-medium text-center py-2 px-4 rounded leading-5'
              type='submit'
              onClick={LookUp}
            >
              Search
            </button>
          </div>
        </form>
        <div className='violations-data'>
          <p>Violations Data:</p>
          <p>Insert Violations Data Here...</p>
        </div>
      </div>
    </main>
  );
}
