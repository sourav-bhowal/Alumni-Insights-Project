import { AppFileRouter } from '@/app/api/uploadthing/core'
import {generateReactHelpers} from '@uploadthing/react'

// uplaodthing components
export const {useUploadThing, uploadFiles} = generateReactHelpers<AppFileRouter>();