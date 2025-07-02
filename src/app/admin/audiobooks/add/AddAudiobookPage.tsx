// app/admin/audiobooks/new/page.tsx
'use client';
import { AddAudiobookProvider } from '@/components/admin/audiobooks/AddAudiobookProvider';
import AddAudiobookHeader from '@/components/admin/audiobooks/AddAudiobookHeader';
import BasicInfoCard from '@/components/admin/audiobooks/BasicInfoCard';
import DurationSettingsCard from '@/components/admin/audiobooks/DurationSettingsCard';
import CategorySelector from '@/components/admin/audiobooks/CategorySelector';
import CoverUploader from '@/components/admin/audiobooks/CoverUploader';
import AudioUploader from '@/components/admin/audiobooks/AudioUploader';
import SubmitActions from '@/components/admin/audiobooks/SubmitActions';
import { Separator } from '@/components/ui/separator';

export default function AddAudiobookPage() {
  return (
    <AddAudiobookProvider>
      <div className="max-w-6xl mx-auto space-y-8 p-6">
        <AddAudiobookHeader />
        <Separator />

        {/* FORM: nothing but layout */}
        <form className="space-y-8">
          {/* Basic info & duration side by side */}
          <div className="grid gap-6 lg:grid-cols-2">
            <BasicInfoCard />
            <DurationSettingsCard />
          </div>

          <CategorySelector />

          {/* Media uploaders */}
          <div className="grid gap-6 lg:grid-cols-2">
            <CoverUploader />
            <AudioUploader />
          </div>

          <SubmitActions />
        </form>
      </div>
    </AddAudiobookProvider>
  );
}
