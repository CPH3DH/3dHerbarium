/**
 * @file IdentificationsLeaders.tsx
 * @fileoverview Client component for displaying the iNaturalist leaderboard info.
 */

'use client';

import { iNatSpecimenLeader } from '@/api/types';

type LeaderboardTableProps = {
  observationsInfo: iNatSpecimenLeader[];
  identificationsInfo: iNatSpecimenLeader[];
  isLoading: boolean;
};

const RESULT_COUNT: number = 10;

const LeaderboardTable: React.FC<LeaderboardTableProps> = (props) => {

  const { observationsInfo, identificationsInfo, isLoading } = props;

  return (
    <>
      <div className="flex flex-wrap justify-center md:justify-between w-full px-1.5 md:px-3 py-5">

        <section className="w-full md:w-1/2 text-center px-1">
          <h4 className="text-[1.1rem] mb-2"><b>Observations</b></h4>
          <table className="w-full mx-auto text-black rounded-md overflow-hidden">
            <thead className="bg-[#004C46] dark:bg-[#212121] text-white">
              <tr className="rounded-t-md">
                <th className='px-1'>Rank</th>
                <th className='px-1'>User</th>
                <th className='px-1'>Count</th>
              </tr>
            </thead>
            <tbody className='bg-[#98B8AD] dark:bg-[#3d3d3d]'>
              {observationsInfo.map((observation, index: number) => {
                return (
                  <tr key={index + observation.user} className={index > RESULT_COUNT ? 'hidden md:table-row' : ''}>
                    <td className='px-1 border-t border-b border-white border-opacity-[50%] text-black dark:text-white'>{index + 1}</td>
                    <td className='px-1 border-t border-b border-white border-opacity-[50%] text-black dark:text-white'>
                      <a target='_blank' rel='noopener noreferrer' className='text-[#002923] dark:text-[#C3D5D1]' href={`https://www.inaturalist.org/observations/${observation.user}`}>{observation.user}</a>
                    </td>
                    <td className='px-1 border-t border-b border-white border-opacity-[50%] text-black dark:text-white'>{observation.count}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className='w-full md:w-1/2 text-center px-1 pt-2 md:pt-0'>
          <h5 className='text-[1.1rem] mb-2'><b>Identifications</b></h5>
          <table className="w-full mx-auto text-black rounded-md overflow-hidden">
            <thead className='bg-[#004C46] dark:bg-[#212121] text-white'>
              <tr>
                <th className='px-1'>Rank</th>
                <th className='px-1'>User</th>
                <th className='px-1'>Count</th>
              </tr>
            </thead>
            <tbody className='bg-[#98B8AD] dark:bg-[#3d3d3d]'>
              {identificationsInfo.map((identification, index: number) => {
                return (
                  <tr key={index + identification.user} className={index > RESULT_COUNT ? 'hidden md:table-row' : ''}>
                    <td className='px-1 border-t border-b border-white border-opacity-[50%] text-black dark:text-white'>{index + 1}</td>
                    <td className='px-1 border-t border-b border-white border-opacity-[50%] text-black dark:text-white'>
                      <a target='_blank' rel='noopener noreferrer' className='text-[#002923] dark:text-[#C3D5D1]' href={`https://www.inaturalist.org/identifications/${identification.user}`}>{identification.user}</a>
                    </td>
                    <td className='px-1 border-t border-b border-white border-opacity-[50%] text-black dark:text-white'>{identification.count}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

      </div>
    </>
  );
};

export default LeaderboardTable;