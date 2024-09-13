import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { useCreateWorkSpaceModal } from "../store/use-create-workspace-modal"

const CreateWorkSpaceModal = () => {

    const [open,setOpen]=useCreateWorkSpaceModal()

    const handleClose=()=>{
        setOpen(false)
        // TODO: Clear form details
    }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Add a WorkSpace</DialogTitle>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}

export default CreateWorkSpaceModal