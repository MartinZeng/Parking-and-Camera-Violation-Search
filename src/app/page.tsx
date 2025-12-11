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
              <small className='m-5 w-md'>Ex: ABC123</small>
            </label>
            <div className='input'>
              <input
                className='border border-slate-300 rounded-xs'
                type='text'
                placeholder='License Plate'
                value={plate}
                onChange={(event) => setPlate(event.target.value.toUpperCase())}
              ></input>
            </div>

            {/* Cancel and Search Buttons */}
            <div className='buttons'>
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
          <form action='#'>
            <div className='items-center mx-auto mb-3 space-y-4 max-w-screen-sm sm:flex sm:space-y-0'>
              <div className='relative w-full'>
                <label
                  for='email'
                  className='hidden mb-2 text-sm font-medium text-gray-900 dark:text-gray-300'
                >
                  Email address
                </label>
                <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
                  <svg
                    className='w-5 h-5 text-gray-500 dark:text-gray-400'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z'></path>
                    <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z'></path>
                  </svg>
                </div>
                <input
                  className='block p-3 pl-10 w-full text-sm bg-white rounded-lg border border-gray-300 sm:rounded-none sm:rounded-l-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                  placeholder='Enter your email'
                  type='email'
                  id='email'
                  required=''
                ></input>
              </div>
              <div>
                <button
                  type='submit'
                  className='py-3 px-3 w-full text-sm font-medium text-center bg-[#42b72a] text-white rounded-lg border cursor-pointer bg-primary-700 border-primary-600 sm:rounded-none sm:rounded-r-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800'
                >
                  Subscribe
                </button>
              </div>
            </div>
          </form>
          {/* <form>
            <label>Subscribe with your email here:</label>
            <input
              className='border border-slate-300 rounded-xs'
              type='text'
              placeholder='abc@def.com'
              value={email}
              onChange={(event) => setPlate(event.target.value.toUpperCase())}
            ></input>
            <button className='bg-[#42b72a] hover:bg-white text-white border border-[#42b72a] hover:text-black hover:border-[#42b72a] focus:ring-1 focus:outline-none focus:ring-[#42b72a] font-medium text-center py-0.5 px-3 rounded mt-3 mb-3 leading-5'>
              Subscribe
            </button>
          </form> */}
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
