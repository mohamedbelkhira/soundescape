// components/audiobooks/CategorySelector.tsx
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tag } from 'lucide-react';
import { useAddAudiobook } from './AddAudiobookProvider';
import { SectionHeading } from '@/components/common/SectionHeading';

export default function CategorySelector() {
  const { categories, form, setField } = useAddAudiobook();

  const toggle = (id: string, checked: boolean) => {
    setField(
      'categoryIds',
      checked ? [...form.categoryIds, id] : form.categoryIds.filter(c => c !== id),
    );
  };

  return (
    <div className="space-y-6">
      <SectionHeading>
        <Tag className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-semibold">Categories</h2>
      </SectionHeading>

      <Card className="border-2">
        <CardHeader>
          <CardTitle>Select Categories</CardTitle>
          <p className="text-sm text-muted-foreground">
            Choose one or more categories that best describe this audiobook
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <Checkbox
                  id={`cat-${cat.id}`}
                  checked={form.categoryIds.includes(cat.id)}
                  onCheckedChange={c => toggle(cat.id, c as boolean)}
                />
                <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer flex-1">
                  {cat.title}
                </Label>
              </div>
            ))}
          </div>

          {form.categoryIds.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 font-medium mb-2">Selected categories:</p>
              <div className="flex flex-wrap gap-2">
                {form.categoryIds.map(id => {
                  const cat = categories.find(c => c.id === id);
                  return cat && (
                    <Badge key={id} variant="secondary" className="bg-green-100 text-green-800">
                      {cat.title}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
