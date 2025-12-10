// import Image from 'next/image';
'use client';
import { FormEvent, useState } from 'react';
import { searchByPlate } from '../lib/socrata';
import { Violation } from './types/index';
import './globals.css';

export default function Home() {
  //defining state for input and fetched data
  const [plate, setPlate] = useState('');
  const [state, setState] = useState('NY');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);// loading state
  const [subscribeMsg, setSubscribeMsg] = useState('');// subscription message state
  const [violations, setViolations] = useState<Violation[]>([]);
  const [error, setError] = useState('');

async function handleSearch(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setViolations([]);

    const params = new URLSearchParams({
      plate: plate.trim(),
      state: state.trim(),
    });

    try {
      const res = await fetch(`/api/tickets?${params.toString()}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Unknown error');
      } else {
        setViolations(json.tickets);
      }
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
      } else{setSubscribeMsg("Subscribed");}
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

  // looks up info when search button is clicked
  const LookUp = async () => {
    if (!plate) return;
    setError('');

    try {
      const data = await searchByPlate(plate);
      setViolations(data);
      // successfully reached here on plate input
      if (data.length === 0) {
        setError('No violations found for this plate');
      }
      console.log('plate', plate);
      console.log('violations', violations);
      console.log('data', data);
    } catch (e) {
      setError('Search failed. Try again.');
      setViolations([]);
    }
  };
  
  // flex items-center justify-center
  return (
    <body className='bg-sky-900'>
    <main className='flex flex-col items-center text-center justify-center'>
        <header className="flex items-center justify-center font-bold text-center text-3xl m-5 mb-10">NYC Parking and Camera Violation Search</header>
      <span className="flex items-center text-center justify-center m-5 w-md">
        <div className="bg-neutral-primary-soft block mfax-w-sm p-6 border border-teal-700 rounded-base bg-slate-200 rounded-lg shadow-xs">
            <h5 className="mb-3 text-2xl font-semibold tracking-tight text-heading leading-8">Search Your License Plate:</h5>
                <form>
                  {/* <label>Search Your License Plate:</label> */}
                  <label className='example-license'>
                    <small>Ex: EFG4321</small>
                  </label>
                  <div className='input'>
                    <input
                      className='border border-blue-300'
                      type='text'
                      placeholder='License plate'
                      value={plate}
                      onChange={(event) => setPlate(event.target.value.toUpperCase())}
                    >
                    </input>
                  </div>

                  {/* Cancel and Search Buttons */}
                  <div className='buttons'>
                    <button
                      className='bg-transparent hover:bg-teal-600 hover:text-white border border-teal-600 hover:border-transparent focus:ring-2 focus:outline-none focus:ring-teal-300 font-medium text-center py-1 px-3 rounded leading-5 m-3'
                      type='reset'
                      onClick={ClearInput}
                    >
                      Cancel
                    </button>
                    <button
                      className='bg-gradient-to-r from-teal-300 to-lime-300 hover:bg-gradient-to-l hover:from-teal-300 hover:to-lime-300 focus:ring-2 focus:outline-none focus:ring-lime-300 font-medium text-center py-1 px-3 rounded leading-5 m-3'
                      type='submit'
                      onClick={LookUp}
                    >
                      Search
                    </button>
                  </div>
                </form>
                <p className="text-body mb-6">Here are the biggest technology acquisitions of 2025 so far, in reverse chronological order.</p>
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
          <p>Violations Data:</p>
          <p>Insert Violations Data Here...</p>
        </div>
    </main>
    </body>
  );
}
// "use client";

// import { FormEvent, useState } from "react";

// export default function HomePage() {
//   const [plate, setPlate] = useState("");
//   const [state, setState] = useState("NY");
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
//   const [subscribeMsg, setSubscribeMsg] = useState("");

//   async function handleSearch(e: FormEvent) {
//     e.preventDefault();
//     setErrorMsg("");
//     setLoading(true);
//     setData(null);

//     const params = new URLSearchParams({
//       plate: plate.trim(),
//       state: state.trim(),
//     });

//     try {
//       const res = await fetch(`/api/tickets?${params.toString()}`);
//       const json = await res.json();

//       if (!res.ok) {
//         setErrorMsg(json.error || "Unknown error");
//       } else {
//         setData(json);
//       }
//     } catch (err) {
//       console.error(err);
//       setErrorMsg("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function handleSubscribe(e: FormEvent) {
//     e.preventDefault();
//     setSubscribeMsg("");
//     setErrorMsg("");

//     try {
//       const res = await fetch("/api/subscriptions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, plate, state }),
//       });

//       const json = await res.json();
//       if (!res.ok) {
//         setSubscribeMsg(json.error || "Failed to subscribe");
//         return;
//       }

//       if (json.alreadySubscribed) {
//         setSubscribeMsg("You are already subscribed for this plate.");
//       } else {
//         setSubscribeMsg("Subscribed! You will be notified about new tickets.");
//       }
//     } catch (err) {
//       console.error(err);
//       setSubscribeMsg("Network error while subscribing");
//     }
//   }

//   return (
//             {/* Subscribe form */}
//             <form
//               onSubmit={handleSubscribe}
//               className="mt-4 flex flex-col md:flex-row gap-3 border-t border-slate-800 pt-4"
//             >
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Your email for ticket alerts"
//                 className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-indigo-500"
//               />
//               <button
//                 type="submit"
//                 disabled={!email || !plate.trim()}
//                 className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-500 transition"
//               >
//                 Notify me for new tickets
//               </button>
//             </form>

//             {subscribeMsg && (
//               <p className="text-xs text-slate-400">{subscribeMsg}</p>
//             )}
//   );
// }

