import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import getContract from 'utils/getContract';
import OrgContract from 'contracts/Org.json';
import { ethers } from 'ethers';

type orgDataType = {
  name: string;
  description: string;
  rewardMultiplier: number;
  rewardToken: string;
  reviewers: string[];
  approvers: string[];
  signers: string[];
  requiredConfirmations: number;
  requiredTaskApprovals: number;
};

const CreateOrganisation: React.FC = () => {
  const { account, library } = useWeb3React();
  const [orgData, setOrgData] = useState<orgDataType>({
    name: '',
    description: '',
    rewardMultiplier: 0,
    rewardToken: ethers.constants.AddressZero,
    reviewers: [],
    approvers: [],
    signers: [],
    requiredConfirmations: 1,
    requiredTaskApprovals: 1,
  });
  const [status, setStatus] = useState<any>({ text: '', error: false });

  const handleChange = (ev: any) => {
    console.log(orgData);
    const label: string = ev.target.name;
    if (label === 'reviewers' || label === 'approvers' || label === 'signers') {
      let prevData = [...orgData[label]];
      prevData[ev.target.id] = ev.target.value;
      setOrgData((prev: any) => ({ ...prev, [label]: [...prevData] }));
      return;
    }
    setOrgData((prev: any) => ({ ...prev, [ev.target.name]: ev.target.value }));
  };

  const addReviewer = () => {
    let preReviewers = [...orgData.reviewers];
    preReviewers.push('');
    setOrgData((prev: any) => ({ ...prev, reviewers: preReviewers }));
  };
  const addApprovers = () => {
    let prevData = [...orgData.approvers];
    prevData.push('');
    setOrgData((prev: any) => ({ ...prev, approvers: prevData }));
  };
  const addSigners = () => {
    let prevData = [...orgData.signers];
    prevData.push('');
    setOrgData((prev: any) => ({ ...prev, signers: prevData }));
  };

  const createOrg: any = async () => {
    const name = orgData.name;
    const description = orgData.description;
    const rewardMultiplier = orgData.rewardMultiplier;

    if (!name || !description || !rewardMultiplier) {
      setStatus({ text: 'Invalid Input. Complete all Fields', error: true });
      return;
    }

    if (!account) {
      setStatus({ text: 'Wallet Not Connected', error: true });
      return;
    }
    try {
      const created = await getContract(
        OrgContract.address,
        OrgContract.abi as any
      )
        .connect(library.getSigner())
        .createOrg(
          name,
          description,
          rewardMultiplier,
          orgData.rewardToken,
          orgData.reviewers,
          [account],
          [account],
          orgData.requiredConfirmations,
          orgData.requiredTaskApprovals,
          { gasLimit: 40000 }
        );
      setStatus({ text: `${name} created successfully`, error: false });
    } catch (error) {
      setStatus({ text: 'Error! Not created', error: true });
      console.error(error);
    }
  };

  return (
    <section className='text-gray-600 body-font relative'>
      <div className='container px-5 py-24 mx-auto'>
        <div className='flex flex-col text-center w-full mb-12'>
          <h1 className='sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900'>
            Create Organisation
          </h1>
          <p
            className={`lg:w-2/3 mx-auto leading-relaxed text-base ${
              status.error ? 'text-red-500' : 'text-green-500'
            }`}
          >
            {status.text}
          </p>
        </div>
        <div className='lg:w-1/2 md:w-2/3 mx-auto'>
          <div className='flex flex-wrap -m-2'>
            <div className='p-2 w-1/2'>
              <div className='relative'>
                <label
                  htmlFor='name'
                  className='leading-7 text-sm text-gray-600'
                >
                  Name
                </label>
                <input
                  type='text'
                  id='name'
                  name='name'
                  value={orgData.name}
                  onChange={handleChange}
                  className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
                />
              </div>
            </div>
            <div className='p-2 w-1/2'>
              <div className='relative'>
                <label
                  htmlFor='email'
                  className='leading-7 text-sm text-gray-600'
                >
                  Reward Multiplier
                </label>
                <input
                  type='number'
                  id='rewardMultiplier'
                  name='rewardMultiplier'
                  value={orgData.rewardMultiplier}
                  onChange={handleChange}
                  className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
                />
              </div>
            </div>
            <div className='p-2 w-1/2'>
              <div className='relative'>
                <label
                  htmlFor='email'
                  className='leading-7 text-sm text-gray-600'
                >
                  Required Confirmations
                </label>
                <input
                  type='number'
                  id='requiredConfirmations'
                  name='requiredConfirmations'
                  value={orgData.requiredConfirmations}
                  onChange={handleChange}
                  className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
                />
              </div>
            </div>
            <div className='p-2 w-1/2'>
              <div className='relative'>
                <label
                  htmlFor='requiredTaskApprovals'
                  className='leading-7 text-sm text-gray-600'
                >
                  Required Task Approvals
                </label>
                <input
                  type='number'
                  id='requiredTaskApprovals'
                  name='requiredTaskApprovals'
                  value={orgData.requiredTaskApprovals}
                  onChange={handleChange}
                  className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
                />
              </div>
            </div>
            <div className='p-2 w-full'>
              <div className='relative'>
                <label
                  htmlFor='requiredTaskApprovals'
                  className='leading-7 text-sm text-gray-600'
                >
                  Reward Tokens
                </label>
                <input
                  id='rewardToken'
                  name='rewardToken'
                  value={orgData.rewardToken}
                  onChange={handleChange}
                  className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
                />
              </div>
            </div>
            <div className='accordion w-full' id='accordionExample'>
              <div className='accordion-item bg-white border border-gray-200'>
                <h2 className='accordion-header mb-0' id='headingOne'>
                  <button
                    className='flex mx-auto text-white bg-slate-600 mt-4 border-0 py-2 px-8 focus:outline-none hover:bg-slate-800 rounded text-lg'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#collapseOne'
                    aria-expanded='true'
                    aria-controls='collapseOne'
                    onClick={addReviewer}
                  >
                    Add Reviewer
                  </button>
                </h2>
                <div
                  id='collapseOne'
                  className='accordion-collapse collapse show'
                  aria-labelledby='headingOne'
                  data-bs-parent='#accordionExample'
                >
                  <div className='accordion-body py-4 px-5'>
                    {orgData.reviewers.map((input, ind) => {
                      return (
                        <div key={ind} className='p-0'>
                          <div className='relative'>
                            <input
                              id={`${ind}`}
                              name='reviewers'
                              value={input}
                              onChange={handleChange}
                              className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className='accordion-item bg-white border border-gray-200'>
                <h2 className='accordion-header mb-0' id='headingTwo'>
                  <button
                    className='flex mx-auto text-white bg-slate-600 mt-4 border-0 py-2 px-8 focus:outline-none hover:bg-slate-800 rounded text-lg'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#collapseTwo'
                    aria-expanded='true'
                    aria-controls='collapseTwo'
                    onClick={addApprovers}
                  >
                    Add Approvers
                  </button>
                </h2>
                <div
                  id='collapseTwo'
                  className='accordion-collapse collapse show'
                  aria-labelledby='headingTwo'
                  data-bs-parent='#accordionExample'
                >
                  <div className='accordion-body py-4 px-5'>
                    {orgData.approvers.map((input, ind) => {
                      return (
                        <div key={ind} className='p-0'>
                          <div className='relative'>
                            <input
                              id={`${ind}`}
                              name='approvers'
                              value={input}
                              onChange={handleChange}
                              className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className='accordion-item bg-white border border-gray-200'>
                <h2 className='accordion-header mb-0' id='headingThree'>
                  <button
                    className='flex mx-auto text-white bg-slate-600 mt-4 border-0 py-2 px-8 focus:outline-none hover:bg-slate-800 rounded text-lg'
                    type='button'
                    data-bs-toggle='collapse'
                    data-bs-target='#collapseThree'
                    aria-expanded='true'
                    aria-controls='collapseThree'
                    onClick={addSigners}
                  >
                    Add Signers
                  </button>
                </h2>
                <div
                  id='collapseThree'
                  className='accordion-collapse collapse'
                  aria-labelledby='headingThree'
                  data-bs-parent='#accordionExample'
                >
                  <div className='accordion-body py-4 px-5'>
                    {orgData.signers.map((input, ind) => {
                      return (
                        <div key={ind} className='p-0'>
                          <div className='relative'>
                            <input
                              id={`${ind}`}
                              name='signers'
                              value={input}
                              onChange={handleChange}
                              className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className='p-2 w-full'>
              <div className='relative'>
                <label
                  htmlFor='message'
                  className='leading-7 text-sm text-gray-600'
                >
                  Description
                </label>
                <textarea
                  id='description'
                  name='description'
                  value={orgData.description}
                  onChange={handleChange}
                  className='w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out'
                ></textarea>
              </div>
            </div>
            <div className='p-2 w-full'>
              <button
                onClick={createOrg}
                className='flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg'
              >
                Create
              </button>
            </div>
            <div className='p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center'>
              <a className='text-indigo-500'>example@email.com</a>
              <p className='leading-normal my-5'>
                49 Smith St.
                <br />
                Saint Cloud, MN 56301
              </p>
              <span className='inline-flex'>
                <a className='text-gray-500'>
                  <svg
                    fill='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='w-5 h-5'
                    viewBox='0 0 24 24'
                  >
                    <path d='M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z'></path>
                  </svg>
                </a>
                <a className='ml-4 text-gray-500'>
                  <svg
                    fill='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='w-5 h-5'
                    viewBox='0 0 24 24'
                  >
                    <path d='M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z'></path>
                  </svg>
                </a>
                <a className='ml-4 text-gray-500'>
                  <svg
                    fill='none'
                    stroke='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='w-5 h-5'
                    viewBox='0 0 24 24'
                  >
                    <rect
                      width='20'
                      height='20'
                      x='2'
                      y='2'
                      rx='5'
                      ry='5'
                    ></rect>
                    <path d='M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01'></path>
                  </svg>
                </a>
                <a className='ml-4 text-gray-500'>
                  <svg
                    fill='currentColor'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    className='w-5 h-5'
                    viewBox='0 0 24 24'
                  >
                    <path d='M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z'></path>
                  </svg>
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateOrganisation;
