import { Metadata } from 'next';
import LayoutEditorClient from './LayoutEditorClient';

export const metadata: Metadata = {
  title: 'Layout Editor | Admin',
  description: 'Visual layout editor for positioning elements',
};

export default function LayoutEditorPage() {
  return <LayoutEditorClient />;
}
