import React from 'react';
import { ViolationTableProps } from '../types/index';

const ViolationTable: React.FC<ViolationTableProps> = ({
  violations,
  loading,
  error,
}) => {
  // Loading States
  if (loading) {
    return <div>Loading tickets...</div>;
  }

  // Failure
  if (error) {
    return <div>Cannot display violation tickets.</div>;
  }

  //No Ticket State
  if (violations.length === 0) {
    return <div>No tickets to display.</div>;
  }

  // Display Table
  violations.sort((a, b) => {
    const dateA = new Date(a.issue_date);
    const dateB = new Date(b.issue_date);

    return dateA.getTime() - dateB.getTime();
  });
  const totalDue = violations.reduce(
    (sum, v) => sum + parseFloat(String(v.amount_due ?? '0')),
    0
  );
  const totalPaid = violations.reduce(
    (sum, v) => sum + parseFloat(String(v.fine_amount || '0')),
    0
  );
  return (
    <div className='relative overflow-x-auto'>
      <table className='w-full text-sm text-left rtl:text-right text-body'>
        <thead className='text-sm text-white text-body bg-[#1877F2] rounded-md m-3 bg-neutral-secondary-medium'>
          <tr>
            <th scope='col' className='px-6 py-3 rounded-s-base font-semibold'>
              Summons Number
            </th>
            <th scope='col' className='px-6 py-3 rounded-e-base font-semibold'>
              Issue Date
            </th>
            <th scope='col' className='px-6 py-3 font-medium'>
              State
            </th>
            <th scope='col' className='px-6 py-3 font-medium'>
              County
            </th>
            <th scope='col' className='px-6 py-3 font-medium'>
              Violation
            </th>
            <th scope='col' className='px-6 py-3 rounded-e-base font-medium'>
              Fine Amount
            </th>
            <th scope='col' className='px-6 py-3 rounded-e-base font-medium'>
              Amount Due
            </th>
          </tr>
        </thead>
        <tbody>
          {violations.map((v) => (
            <tr key={v.summons_number} className='bg-neutral-primary'>
              <th
                scope='row'
                className='px-6 py-4 font-medium text-heading whitespace-nowrap'
              >
                {v.summons_number}
              </th>
              <td className='px-6 py-4'>{v.issue_date || 'N/A'}</td>
              <td className='px-6 py-4'>{v.state || 'N/A'}</td>
              <td className='px-6 py-4'>{v.county || 'N/A'}</td>
              <td className='px-6 py-4'>{v.violation || 'UNKNOWN'}</td>
              <td className='px-6 py-4'>{v.fine_amount || 'N/A'}</td>
              <td className='px-6 py-4'>{v.amount_due || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className='font-semibold text-heading'>
            <th scope='row' className='px-6 py-3 text-base'>
              Total
            </th>
            <td className='px-6 py-3'></td>
            <td className='px-6 py-3'></td>
            <td className='px-6 py-3'></td>
            <td className='px-6 py-3'></td>
            <td className='px-6 py-3'>{totalPaid}</td>
            <td className='px-6 py-3'>{totalDue}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default ViolationTable;
