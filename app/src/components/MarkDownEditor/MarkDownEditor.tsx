import dynamic from 'next/dynamic'
import 'react-markdown-editor-lite/lib/index.css'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

interface IEditorProps {
  setValue: (value: any) => void
  value?: { text: string; html: string }
  height?: string
  readonly?: boolean
}

const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false
})

const MarkDownEditor: React.FC<IEditorProps> = ({
  setValue,
  value,
  height = '500px',
  readonly = false
}) => {
  return (
    <MdEditor
      style={{ height }}
      renderHTML={(text) => (
        <ReactMarkdown remarkPlugins={[gfm]} className='markdown'>
          {text}
        </ReactMarkdown>
      )}
      onChange={setValue}
      value={value?.text}
      readOnly={readonly}
    />
  )
}

export default MarkDownEditor
