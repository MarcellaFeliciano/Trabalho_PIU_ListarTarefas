import { use, useState } from "react"

export default function InputColor() {

    const [text, setText] = useState('')

    const handleSubmit = () => {
        if (text === 'oi') {
    document.body.style.backgroundColor = 'blue';
  }
    }
    return (

        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" onChange={(e)=>setText(e.target.value)} value={text} />
            </form>
        </div>
    )
}