import { useEditor, useEditorState } from '@tiptap/react'
import deepEqual from 'fast-deep-equal'
import type { AnyExtension, Editor } from '@tiptap/core'
import { ExtensionKit } from '@/extensions/extension-kit'
import type { EditorUser } from '../components/BlockEditor/types'

declare global {
  interface Window {
    editor: Editor | null
  }
}

export const useBlockEditor = () => {
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    autofocus: true,
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
  const users = useEditorState({
    editor,
    selector: (ctx): (EditorUser & { initials: string })[] => {
      if (!ctx.editor?.storage.collaborationCursor?.users) {
        return []
      }

      return ctx.editor.storage.collaborationCursor.users.map((user: EditorUser) => {
        const names = user.name?.split(' ')
        const firstName = names?.[0]
        const lastName = names?.[names.length - 1]
        const initials = `${firstName?.[0] || '?'}${lastName?.[0] || '?'}`

        return { ...user, initials: initials.length ? initials : '?' }
      })
    },
    equalityFn: deepEqual,
  })

  window.editor = editor

  return { editor }
}
