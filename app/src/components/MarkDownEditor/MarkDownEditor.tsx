import dynamic from 'next/dynamic'
import { ChangeEvent, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import Editor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css'
import gfm from 'remark-gfm'

interface IEditorProps extends React.ComponentProps<typeof Editor> {
  onChange?: (
    value: { text: string; html?: string },
    event?: ChangeEvent<HTMLTextAreaElement>
  ) => void
  value?: { text: string; html?: string }
  height?: string | number
  readonly?: boolean
  hideToggle?: boolean
}

const MdEditor = dynamic(
  async () => {
    const { default: Md } = await import('react-markdown-editor-lite')

    // eslint-disable-next-line react/display-name
    return ({
      forwardedRef,
      ...props
    }: React.ComponentProps<typeof Editor>) => (
      <Md {...props} ref={forwardedRef} />
    )
  },
  {
    ssr: false
  }
) as typeof Editor

const MarkDownEditor: React.FC<IEditorProps> = ({
  onChange,
  value,
  height = '500px',
  readonly = false,
  hideToggle,
  ...props
}) => {
  const [togglePreview, setTogglePreview] = useState(false)
  const mdEditor = useRef<Editor>(null)

  const htmlMode = () =>
    mdEditor.current?.setView?.({ menu: false, html: true, md: false })

  const markdownMode = () =>
    mdEditor.current?.setView?.({ menu: true, html: false, md: true })

  return (
    <div>
      {!hideToggle && (
        <div className='relative mb-3 flex justify-end'>
          <input
            className='toggle'
            type='checkbox'
            role='switch'
            id='flexSwitchCheckDefault'
            checked={togglePreview}
            onChange={() => {
              setTogglePreview((prev) => {
                if (prev) markdownMode()
                else htmlMode()

                return !prev
              })
            }}
          />
          <label
            className='inline-block pl-[0.15rem] hover:cursor-pointer'
            htmlFor='flexSwitchCheckDefault'
          >
            Preview
          </label>
        </div>
      )}
      <MdEditor
        /* @ts-ignore next-line */
        forwardedRef={mdEditor}
        style={{ height }}
        renderHTML={(text) => (
          <ReactMarkdown remarkPlugins={[gfm]} className='markdown'>
            {text}
          </ReactMarkdown>
        )}
        onChange={onChange}
        value={value?.text}
        readOnly={readonly}
        view={
          readonly
            ? { menu: false, md: false, html: true }
            : hideToggle
            ? undefined
            : { menu: true, html: false, md: true }
        }
        {...props}
      />
    </div>
  )
}

export default MarkDownEditor
