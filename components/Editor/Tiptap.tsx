import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import s from './ButtonRow.module.scss';
import cN from 'classnames';

type TiptapProps = {
  content: string;
  updateContent: (content: string) => void;
};

export const Tiptap = ({ content, updateContent }: TiptapProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate({ editor }) {
      updateContent(editor.getHTML());
    },
  });

  // console.log(editor?.getHTML());

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className={s.buttonRow}>
      {/* <button
        className={s.rowButton}
        onClick={() => editor.chain().focus().setHardBreak().run()}
      >
        Absatz{' '}
      </button> */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cN(s.rowButton, editor.isActive('bold') ? 'is-active' : '')}
      >
        bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cN(
          s.rowButton,
          editor.isActive('italic') ? 'is-active' : ''
        )}
      >
        italic
      </button>
      {/* <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={cN(
          s.rowButton,
          editor.isActive('strike') ? 'is-active' : ''
        )}>
        strike
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={cN(s.rowButton, editor.isActive('code') ? 'is-active' : '')}>
        code
      </button>
      <button
        className={s.rowButton}
        onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        clear marks
      </button>
      <button
        className={s.rowButton}
        onClick={() => editor.chain().focus().clearNodes().run()}>
        clear node
      </button> */}
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={cN(
          s.rowButton,
          editor.isActive('paragraph') ? 'is-active' : ''
        )}
      >
        paragraph
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cN(
          s.rowButton,
          editor.isActive('heading', { level: 1 }) ? 'is-active' : ''
        )}
      >
        h1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cN(
          s.rowButton,
          editor.isActive('heading', { level: 2 }) ? 'is-active' : ''
        )}
      >
        h2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cN(
          s.rowButton,
          editor.isActive('heading', { level: 3 }) ? 'is-active' : ''
        )}
      >
        h3
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={cN(
          s.rowButton,
          editor.isActive('heading', { level: 4 }) ? 'is-active' : ''
        )}
      >
        h4
      </button>
      {/* <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        className={cN(
          s.rowButton,
          editor.isActive('heading', { level: 5 }) ? 'is-active' : ''
        )}>
        h5
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        className={cN(
          s.rowButton,
          editor.isActive('heading', { level: 6 }) ? 'is-active' : ''
        )}>
        h6
      </button> */}
      {/* <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cN(
          s.rowButton,
          editor.isActive('bulletList') ? 'is-active' : ''
        )}>
        bullet list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cN(
          s.rowButton,
          editor.isActive('orderedList') ? 'is-active' : ''
        )}>
        ordered list
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={cN(
          s.rowButton,
          editor.isActive('codeBlock') ? 'is-active' : ''
        )}>
        code block
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={cN(
          s.rowButton,
          editor.isActive('blockquote') ? 'is-active' : ''
        )}>
        blockquote
      </button>
      <button
        className={s.rowButton}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        horizontal rule
      </button>
      <button
        className={s.rowButton}
        onClick={() => editor.chain().focus().undo().run()}>
        undo{' '}
      </button>
      <button
        className={s.rowButton}
        onClick={() => editor.chain().focus().redo().run()}>
        redo{' '}
      </button> */}
    </div>
  );
};
