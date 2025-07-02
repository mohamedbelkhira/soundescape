// components/audiobooks/DurationSettingsCard.tsx
'use client';
import { Clock, Crown, Eye, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAddAudiobook } from './AddAudiobookProvider';
import { formatDuration } from '@/lib/utils';

export default function DurationSettingsCard() {
  const { form, setField, errors, setErrors } = useAddAudiobook();

  const clear = (k: keyof typeof errors) => errors[k] && setErrors(e => ({ ...e, [k]: undefined }));

  return (
    <Card className="border-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Duration &amp; Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="totalTime">Duration (seconds)</Label>
          <Input
            id="totalTime"
            type="number"
            value={form.totalTime}
            onChange={e => {
              setField('totalTime', e.target.value);
              clear('totalTime');
            }}
            min="0"
            className={errors.totalTime ? 'border-red-500' : ''}
          />
          {form.totalTime && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 font-medium">
                {formatDuration(Number(form.totalTime))}
              </p>
            </div>
          )}
          {errors.totalTime && (
            <p className="text-sm text-red-500 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.totalTime}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {/* Publish */}
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <Checkbox
              id="isPublished"
              checked={form.isPublished}
              onCheckedChange={c => setField('isPublished', c as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor="isPublished" className="cursor-pointer">Publish immediately</Label>
              <p className="text-xs text-muted-foreground">Visible to users right away</p>
            </div>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Premium */}
          <div className="flex items-center gap-3 p-3 border rounded-lg">
            <Checkbox
              id="isPremium"
              checked={form.isPremium}
              onCheckedChange={c => setField('isPremium', c as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor="isPremium" className="cursor-pointer">Premium content</Label>
              <p className="text-xs text-muted-foreground">Requires subscription</p>
            </div>
            <Crown className="h-4 w-4 text-yellow-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
