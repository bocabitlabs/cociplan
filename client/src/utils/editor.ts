import { Link } from "@mantine/tiptap";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextHtml from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";

const renderExtensions = [
  Bold,
  BulletList,
  Document,
  Highlight,
  Heading,
  ListItem,
  OrderedList,
  Paragraph,
  StarterKit,
  Superscript,
  SubScript,
  TextHtml,
  Underline,
  Link,
];

const editorExtensions = [
  ...renderExtensions,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
];

export { editorExtensions, renderExtensions };
export default editorExtensions;
