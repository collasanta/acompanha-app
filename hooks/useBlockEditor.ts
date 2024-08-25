"use client"

import { useEditor } from '@tiptap/react'
import type { AnyExtension, Editor } from '@tiptap/core'
import { ExtensionKit } from '@/tiptap/extensions/extension-kit'
import { initialContent } from '@/lib/initialContent'

declare global {
  interface Window {
    editor: Editor | null
  }
}

export const useBlockEditor = ({content} : {content?:JSON | undefined }) => {
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    autofocus: true,
    onCreate: ctx => {
      if (content) {
        console.log({content})
        ctx.editor.commands.setContent(content)
      }
      if (ctx.editor.isEmpty) {
        ctx.editor.commands.setContent(initialContent)
        ctx.editor.commands.focus('start', { scrollIntoView: true })
      }
    },
    extensions: [...ExtensionKit()].filter((e): e is AnyExtension => e !== undefined),
    editorProps: {
      attributes: {
        autocomplete: 'off',
        autocorrect: 'off',
        autocapitalize: 'off',
        class: 'min-h-full',
      },
    },
  })
  
  if (typeof window !== 'undefined') {
    window.editor = editor
  }

  return { editor }
}
