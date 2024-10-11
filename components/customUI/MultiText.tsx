"use client"

import { useState } from 'react'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { X } from 'lucide-react'

interface MultiTextProps {
    placeholder: string,
    value: string[],
    onChange: (value: string) => void
    onRemove: (value: string) => void

}

const MultiText: React.FC<MultiTextProps> = ({ placeholder, value, onChange, onRemove }) => {


    const [inputValue, setInputValue] = useState("")

    const addValue = (addValue: string) => {
        onChange(addValue)
        setInputValue("")
    }

    return (
        <>
            <Input placeholder={placeholder} value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                    if ((e.key).toLowerCase() === ('Enter').toLowerCase() && inputValue !== '') {
                        e.preventDefault();
                        addValue(inputValue)
                    }
                }} />
            <div className='flex flex-wrap gap-1 mt-4'>
                {value !== undefined && value.length > 0 && value.map((item, index) => (
                    <Badge key={index} className='bg-grey-1 text-white rounded-lg'>
                        {item}
                        <button type='button' className='ml-1 rounded-full outline-none hover:bg-red-1' onClick={() => onRemove(item)}>
                            <X className='w-3 h-3' />
                        </button>
                    </Badge>
                ))}
            </div>
        </>
    )
}

export default MultiText