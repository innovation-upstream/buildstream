import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const defaultProvider = ethers.getDefaultProvider('goerli')

const useContract = (address: string, abi: any, provider = defaultProvider) => {
    let initialContract = new ethers.Contract(address, abi, provider)
    const [contract, setContract] = useState<ethers.Contract>(initialContract)

    useEffect(() => {
        if (!address && abi) return
        const updateContract = new ethers.Contract(address, abi, provider)
        setContract(updateContract)
    }, [address, abi, provider])

    return { contract }
}

export default useContract