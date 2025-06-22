import { useState, useRef } from 'react'
import { useChatStore } from '../store/useChatStore'
import { Send, Image } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { X } from 'lucide-react'

const ChatInput = () => {
  const [messagetext, setmessagetext] = useState("")
  const [messageimage, setmessageimage] = useState(null)
  const [previewimage, setpreviewimage] = useState(false)
  const { sendMessage } = useChatStore()
  const fileinput = useRef(null)



  const handlesendmessage = async () => {
    try {
      if (!messageimage && !messagetext) {
        return toast.error("Enter a message to send")
      }
      await sendMessage(messagetext, messageimage)
      toast.success("Sent Message Succesfully")
    } catch (error) {
      toast.error("Error while sending Message")
    } finally {
      if (fileinput.current) fileinput.current.value = ""  // removing file after sent
      setmessagetext("")
      setmessageimage(null)
      setpreviewimage(false)
    }
  }




  const handleImageUpload = async (e) => {
    const file = e.target.files[0]  // get first file which contains image uploaded by the user
    if (!file) {
      return
    }

    const reader = new FileReader()  /// to access file and convert it into base64 image
    reader.readAsDataURL(file)  // converts the image file into a base64-encoded Data URL.

    reader.onload = async () => {
      setpreviewimage(true)
      const base64image = reader.result;
      setmessageimage(base64image); <img className='size-20' src={`${messageimage}`} alt="" />
    }

  }

  const removeuploadedimage = () => {
    if (fileinput.current) fileinput.current.value = ""  // setting the input to empty as it is removed
    setmessageimage(null)
    setpreviewimage(false)
  }



  return (
    <div className='flex p-4 gap-4 items-center bg-base-100 relative '>
      <div className='flex-1'><input type="text" value={messagetext} onChange={(e) => setmessagetext(e.target.value)} className='w-full p-3 border border-base-300 rounded-md bg-base-100' placeholder='Type a message' /></div>
      <div>
        {previewimage && (
          <div className='absolute left-4 bottom-20'><div className="bg-base-200 relative p-3"><img
            className="size-20 object-contain"
            src={`${messageimage}`}
            alt=""
          />

            <X className='absolute  size-6 bottom-24 left-24 hover:text-red-400' onClick={removeuploadedimage} /></div></div>
        )}
        <label
          htmlFor="avatar-upload"
          className={` 
                  p-2  cursor-pointer 
                  transition-all duration-200
                `}
        >
          <Image />
          <input
            type="file"
            id="avatar-upload"
            className="hidden"
            accept="image/*"
            ref={fileinput}
            onChange={handleImageUpload}
          />
        </label></div>

      <div><Send onClick={() => handlesendmessage()} /></div>
    </div>
  )
}

export default ChatInput


