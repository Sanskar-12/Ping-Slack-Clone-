import dynamic from "next/dynamic"

// cant use the quill in server side because quill doesnt support server side rendering and nextjs does ssr so we have do dynamic import by doing ssr = false
const Editor=dynamic(()=>import("@/components/editor"),{ssr:false}) 

 
const ChatInput = () => {
  return (
    <div className="px-5 w-full">
        <Editor variant="create"/>
    </div>
  )
}

export default ChatInput