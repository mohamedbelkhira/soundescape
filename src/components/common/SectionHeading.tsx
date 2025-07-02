// components/common/SectionHeading.tsx
'use client';
import { FC, PropsWithChildren } from 'react';

export const SectionHeading: FC<PropsWithChildren> = ({ children }) => (
  <div className="flex items-center gap-2">{children}</div>
);
