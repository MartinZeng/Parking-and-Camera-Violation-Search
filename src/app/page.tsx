// import Image from 'next/image';
'use client';
import { FormEvent, useState } from 'react';
import { Violation } from './types/index';
import './globals.css';
import './layout.tsx';
import ViolationTable from './components/ViolationTable';

export default function Home() {
  //defining state for input and fetched data
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('NY');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // loading state
  const [subscribeMsg, setSubscribeMsg] = useState(''); // subscription message state
  const [violations, setViolations] = useState<Violation[]>([]);
  const [error, setError] = useState('');

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setViolations([]);

    const params = new URLSearchParams({
      plate: plate.trim(),
    });

    try {
      const res = await fetch(`/api/tickets?${params.toString()}`);
      const json = await res.json();

      console.log(json);

      if (!res.ok) {
        setError(json.error || 'Unknown error');
      } else {
        setViolations(json.tickets);
      }

      console.log(violations);
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubscribe(e: FormEvent) {
    e.preventDefault();
    setSubscribeMsg('');
    setError('');

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, plate, state }),
      });

      const json = await res.json();
      if (!res.ok) {
        setSubscribeMsg(json.error || 'Failed to subscribe');
        return;
      }

      if (json.alreadySubscribed) {
        setSubscribeMsg('You are already subscribed for this plate.');
      } else {
        setSubscribeMsg('Subscribed');
      }
    } catch (err) {
      console.error(err);
      setSubscribeMsg('Network error while subscribing');
    }
  }

  // clears input when cancel button is clicked
  function ClearInput() {
    setPlate('');
    setViolations([]);
    setError('');
  }

  // flex items-center justify-center
  return (
    <main className='flex flex-col items-center text-center justify-center'>
      <header className='flex items-center justify-center font-bold text-center text-4xl m-5 mb-5 p-6 text-[#1877F2]'>
        NYC Parking and Camera Violation Search
      </header>
      <span className='flex items-center bg-white text-center justify-center m-5 mb-20 w-md '>
        <div className='bg-neutral-primary-soft block mfax-w-sm p-6 border border-blue-600 rounded-base rounded-lg shadow-xs'>
          <h5 className='mb-3 text-2xl font-semibold tracking-tight text-heading leading-8'>
            Search Your License Plate:
          </h5>
          <form>
            {/* <label>Search Your License Plate:</label> */}
            <label className='example-license'>
              <small className='m-5 w-md pb-1'>Ex: ABC123</small>
            </label>
            <div className='input'>
              <input
                className='border border-slate-300 rounded-xs'
                type='text'
                placeholder=' License Plate'
                value={plate}
                onChange={(event) => setPlate(event.target.value.toUpperCase())}
              ></input>
            </div>

            {/* Cancel and Search Buttons */}
            <div className='buttons mb-5'>
              <button
                className='bg-white hover:bg-[#1877F2] hover:text-white border border-[#1877F2] hover:border-transparent focus:ring-1 focus:outline-none focus:ring-cyan-600 font-medium text-center py-1 px-4.5 rounded leading-5 m-3'
                type='reset'
                onClick={ClearInput}
              >
                Clear
              </button>
              <button
                className='bg-[#1877F2] hover:bg-white text-white border border-[#1877F2] hover:text-black hover:border-[#1877F2] focus:ring-1 focus:outline-none focus:ring-[#1877F2] font-medium text-center py-1 px-3 rounded leading-5 m-3'
                type='submit'
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </form>
          <form>
            <label>Subscribe with your email here:</label>
            <input
              className='border border-slate-300 rounded-xs py-0.1'
              type='text'
              placeholder=' abc@def.com'
              value={email}
              onChange={(event) => handleSubscribe}
            ></input>
            <div>
            <button className='bg-[#42b72a] text-sm w-1/5 text-white border border-[#42b72a] hover:ring-1 hover:ring-[#42b72a] focus:ring-1 focus:outline-none focus:ring-[#2c791c] font-medium text-center p-1.5 rounded m-3 leading-5'>
              Subscribe
            </button>
            </div>
          </form>
          <p className='text-body mb-6'>
            Here is more information about any tickets or violations you may
            have:
          </p>
        </div>
        {/* Error Message */}
        {error && (
          <span>
            <p className='text-red'>{error}</p>
          </span>
        )}
      </span>
      {/* Display Violations Data */}
      <div className='violations-data'>
        <ViolationTable
          violations={violations}
          loading={loading}
          error={error}
        />
        {/* <p>{violations}</p> */}
      </div>
    </main>
  );
}
