'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Exclude non-icon exports from lucide-react
const excludedIcons = new Set([
  'createReactComponent', 'icons', 'LucideProps', 'LucideIcon', 
  'ForwardRefExoticComponent', 'RefAttributes', 'ElementRef'
]);

const iconList = Object.keys(LucideIcons)
  .filter((key) => !excludedIcons.has(key) && /^[A-Z]/.test(key))
  .sort();

interface IconPickerProps {
  value?: string;
  onChange: (value: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = React.useState(false);

  const Icon = value ? (LucideIcons as any)[value] : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[150px] justify-between"
        >
          {Icon ? (
            <>
              <Icon className="mr-2 h-4 w-4" />
              {value}
            </>
          ) : (
            'Select icon...'
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search icon..." />
          <CommandList>
            <CommandEmpty>No icon found.</CommandEmpty>
            <CommandGroup>
              {iconList.map((iconName) => {
                const CurrentIcon = (LucideIcons as any)[iconName];
                if (!CurrentIcon) return null;

                return (
                  <CommandItem
                    key={iconName}
                    value={iconName}
                    onSelect={(currentValue) => {
                      // Find the icon name from the list to ensure correct casing
                      const correctName = iconList.find(icon => icon.toLowerCase() === currentValue.toLowerCase()) || '';
                      onChange(correctName);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === iconName ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    <CurrentIcon className="mr-2 h-4 w-4" />
                    {iconName}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
