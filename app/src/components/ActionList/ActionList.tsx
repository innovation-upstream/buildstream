import { useWeb3 } from 'hooks'
import ListView from 'components/ListView/ListView'
import Spinner from 'components/Spinner/Spinner'
import injected from 'config/Walletconnectors'
import { useGetActionsQuery, usePolling } from 'hooks'
import { confirmAction } from 'hooks/action/functions'
import { Action, ActionTypeMap } from 'hooks/action/types'
import useActions from 'hooks/action/useAction'
import { executeAction } from 'hooks/organization/functions'
import { useEffect, useState } from 'react'
import { Converter } from 'utils/converter'

interface ActionListProps {
  orgId: number
}

const ActionList = ({ orgId }: ActionListProps) => {
  const [actions, setActions] = useState<Action[]>([])
  const [isConfirming, setIsConfirming] = useState(false)
  const [isExecuting, setIsExecuting] = useState(false)
  const [selected, setSelected] = useState(-1)
  const { account, library, activate } = useWeb3()
  const { data, startPolling, stopPolling } = useGetActionsQuery({
    variables: {
      where: {
        orgId: orgId.toString() as any
      }
    }
  })
  usePolling(startPolling, stopPolling)

  useEffect(() => {
    if (data?.actions) {
      const orgActions = data?.actions
      setActions(orgActions?.map((a) => Converter.ActionFromQuery(a)) || [])
    }
  }, [data])

  const onConfirmAction = async (actionId: number) => {
    setSelected(actionId)
    setIsConfirming(true)
    try {
      await confirmAction(actionId, library.getSigner())
    } catch (e) {
      console.error(e)
    }
    setIsConfirming(false)
  }

  const onExecuteAction = async (actionId: number) => {
    setSelected(actionId)
    setIsExecuting(true)
    try {
      await executeAction(actionId, library.getSigner())
    } catch (e) {
      console.error(e)
    }
    setIsExecuting(false)
  }

  async function connect() {
    try {
      await activate(injected)
    } catch (ex) {
      console.log(ex)
    }
  }

  return (
    <div>
      <h3 className='font-bold text-xl ml-3 mb-3'>Actions</h3>
      <ListView itemCount={actions.length} className='divide-y divide-gray-100'>
        {actions.map((action) => {
          const actionConfirmers = action.approvedBy
          return (
            <li
              key={`${action.id}`}
              className='p-3 hover:bg-blue-100 hover:text-blue-600'
            >
              <h3 className='font-bold text-l'>
                {ActionTypeMap[action.actionType]}{' '}
                {action.executed ? 'executed' : 'not executed'}
              </h3>
              <p className='mt-1 text-gray-500'>{action.initiator}</p>
              <p className='mt-1'>
                Target:{' '}
                <span className='text-gray-500'>{action.targetAddress}</span>
              </p>
              <p className='mt-1'>
                Confirmers count:{' '}
                <span className='text-gray-500'>
                  {actionConfirmers?.length}
                </span>
              </p>
              <div className='flex justify-between items-center mt-5 gap-3'>
                <div className='flex gap-3 flex-wrap'>
                  {account &&
                    !actionConfirmers?.includes(account) &&
                    !action.executed && (
                      <button
                        onClick={() => onConfirmAction(action.id)}
                        className='px-4 py-2 font-semibold text-sm bg-cyan-500 hover:bg-cyan-800 text-white rounded-full shadow-sm'
                      >
                        {selected === action.id && isConfirming ? (
                          <Spinner />
                        ) : (
                          'Confirm'
                        )}
                      </button>
                    )}
                  {account && !action.executed && (
                    <button
                      onClick={() => onExecuteAction(action.id)}
                      className='px-4 py-2 font-semibold text-sm text-white rounded-full shadow-sm bg-red-400 hover:bg-red-800'
                    >
                      {selected === action.id && isExecuting ? (
                        <Spinner />
                      ) : (
                        'Execute'
                      )}
                    </button>
                  )}
                  {!account && (
                    <button
                      onClick={connect}
                      className='px-4 py-2 font-semibold text-sm text-white rounded-full shadow-sm bg-cyan-500 hover:bg-cyan-800'
                    >
                      Connect wallet
                    </button>
                  )}
                </div>
                <button className='flex gap-3 text-blue-500'>
                  View
                  <svg
                    width='24'
                    height='24'
                    xmlns='http://www.w3.org/2000/svg'
                    fillRule='evenodd'
                    clipRule='evenodd'
                    className='fill-blue-500'
                  >
                    <path d='M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z' />
                  </svg>
                </button>
              </div>
            </li>
          )
        })}
      </ListView>
    </div>
  )
}

export default ActionList
